# Requirements Document

## Introduction
**Feature:** Vix agent (Python: LiveKit Agents + LangGraph)

`apps/vix-agent` is the voice-and-vision lab guide. It joins a LiveKit room with one student, listens, reads a live ScreenMap of the student's lab (and, when needed, a screen-share frame), reasons with a LangGraph graph, speaks back, and points at the screen through whitelisted RPCs. It never changes experiment state and never gives answers in graded mode. The client side (buttons, overlays, captions) is specified in `vix-guide`; shared shapes are in steering `contracts.md`; safety rules in steering `vix-safety.md`.

## Glossary
- **Agent**: the LiveKit Agents worker process.
- **Session**: one VIX_SESSION; one LiveKit room; one student.
- **Graph**: the LangGraph state machine that decides every reply.
- **ScreenMap**: JSON published by the web client on topic `vix.screenmap` (contracts §4).
- **Frame**: a JPEG sampled from the student's screen-share track.
- **Policy_Guard**: the graph node that checks every outgoing message against the mode rules.
- **Tour**: an ordered list of regions with narration.

## Requirements

### Requirement 1 — Session lifecycle (P0)
**User Story:** As a student, I want Vix to join quickly when I call and leave cleanly when I end, so that it feels like a real call.

#### Acceptance Criteria
1. WHEN the API dispatches the Agent to a room with `{ sessionId }` metadata THE Agent SHALL join, fetch session context from `/internal/vix/sessions/{id}/context` with its service token, and greet the student by first name within 3 seconds.
2. IF the context says mode EXAM THEN THE Agent SHALL leave the room immediately without speaking.
3. WHEN the student leaves or presses End THE Agent SHALL post `/end` with the turn count and disconnect within 2 seconds.
4. WHEN a session is idle (no student speech or input) for 5 minutes THE Agent SHALL say a short goodbye and end the session.
5. THE Agent SHALL handle at least 20 concurrent sessions per worker on a 2 vCPU / 4 GB machine.

### Requirement 2 — Voice pipeline (P0)
**User Story:** As a student, I want to talk naturally and be heard, so that I don't have to type.

#### Acceptance Criteria
1. THE Agent SHALL use an AgentSession with VAD (Silero), streaming STT, the LLM, and streaming TTS, with turn detection.
2. THE Agent SHALL begin speaking within 1.2 seconds of the end of the student's speech at p50 and 2.5 seconds at p95.
3. WHEN the student speaks while Vix is speaking THE Agent SHALL stop speaking (barge-in) and attend to the student.
4. THE Agent SHALL accept typed messages sent on topic `vix.chat` and answer them the same way as speech.
5. THE Agent SHALL send its own words to the client as captions with `showCaption` (partial then final).
6. THE Agent SHALL use the voice chosen at connect (ada, tunde, grace) and the session locale; WHERE the TTS provider lacks that locale THE Agent SHALL speak English and show captions in the chosen language when available.

### Requirement 3 — Seeing the screen (P0 map, P1 frames)
**User Story:** As a student, I want Vix to know what I'm looking at, so that "what is this?" gets a useful answer.

#### Acceptance Criteria
1. THE Agent SHALL keep the latest ScreenMap per session and request a fresh one on `vix.screenmap.request` before answering any screen question older than 2 seconds.
2. THE Agent SHALL resolve region and element references (e.g. "the orange ball", "this panel on the right") to ScreenMap ids using labels, kinds and bounding-box positions.
3. (P1) WHEN a reference cannot be resolved from the ScreenMap with confidence ≥ 0.7 THE Agent SHALL sample the latest screen-share Frame (≤ 1024 px, JPEG) and send it to the vision model with the ScreenMap.
4. (P1) THE Agent SHALL sample Frames at most 1 per second while the student speaks and 1 per 5 seconds otherwise, and only when the student consented to screen sharing.
5. THE Agent SHALL never request or store Frames when screen consent is false.

### Requirement 4 — Explaining the screen (P0)
**User Story:** As a student new to labs, I want a guided tour of the screen, so that I know what each part does.

#### Acceptance Criteria
1. WHEN the student asks to explain the screen THE Graph SHALL build a Tour from the scripted tour for the screen code, filtered to visible regions, and send `startTour`.
2. FOR each Tour step THE Agent SHALL call `spotlight(regionId)`, then speak that step's narration, then wait for "next", a 1.5-second pause after speech, or a question.
3. WHEN the student says back, again, next or stop THE Agent SHALL move the Tour accordingly (`tourStep`, repeat, `endTour`).
4. WHEN the student asks about one region THE Agent SHALL `spotlight` or `pointAt` it and explain its purpose in at most 3 sentences.
5. THE Agent SHALL only use region and element ids present in the latest ScreenMap.

### Requirement 5 — Guiding the practical (P0)
**User Story:** As a student mid-experiment, I want to know what to do next without being given the answer.

#### Acceptance Criteria
1. WHEN the student asks what to do next THE Graph SHALL compare ScreenMap `sim` state and `experiment.step` with the experiment procedure and state the next procedure step as an instruction or a question.
2. WHEN the ScreenMap shows a warning (e.g. ANGLE_OVER_10, PARALLAX, OVERSHOOT) THE Agent MAY mention it once, as a question about the cause.
3. WHEN the student asks a concept question THE Graph SHALL retrieve from the experiment's briefing, theory and glossary and answer Socratically: one short explanation plus one question back.
4. WHEN the student asks about safety THE Graph SHALL answer from the experiment's precautions and hazards.
5. WHEN the student goes off topic THE Agent SHALL steer back to the practical in one sentence.

### Requirement 6 — Mode policy (P0)
**User Story:** As a teacher, I want Vix to help without doing graded work, so that marks stay honest.

#### Acceptance Criteria
1. WHILE the mode is GRADED THE Agent SHALL NOT say or caption any reading, calculated value, slope, final result, or whether a specific value is correct.
2. THE Policy_Guard SHALL check every outgoing message before TTS; IF a message breaks the policy THEN it SHALL be rewritten once by the LLM with the violation named, and IF still failing it SHALL be replaced with a safe guiding question.
3. THE Policy_Guard SHALL use both a rule check (numbers with units, "the answer is", "your g is", digits adjacent to the experiment's quantities) and an LLM classifier, and block if either flags.
4. WHILE the mode is PRACTICE THE Agent MAY explain worked methods with the student's own numbers, but SHALL still ask the student to compute the final value themselves first.
5. THE Agent SHALL refuse requests to change the experiment, submit work, or reveal hidden values, in every mode.
6. THE Agent SHALL log each blocked message with policy_blocked = true when transcripts are retained.

### Requirement 7 — Acting on the screen (P0)
**User Story:** As a student, I want Vix to point at things, so that I see exactly what it means.

#### Acceptance Criteria
1. THE Agent SHALL act on the screen only through the RPCs in contracts §5.
2. WHEN an RPC returns an error THE Agent SHALL not retry more than once and SHALL describe the location in words instead.
3. THE Agent SHALL end any active spotlight or tour before the session ends (`endTour`).

### Requirement 8 — Safety and privacy for minors (P0)
**User Story:** As a parent or school, I want Vix to be safe for children.

#### Acceptance Criteria
1. THE Agent SHALL include only the student's first name, the mode, the locale and the experiment content in model prompts.
2. THE Agent SHALL keep an encouraging, age-appropriate tone, avoid personal questions, and decline unsafe or unrelated requests.
3. WHERE transcript retention is off THE Agent SHALL keep the conversation only in memory for the session and discard it at end.
4. THE Agent SHALL never record audio.

### Requirement 9 — Resilience (P0)
**User Story:** As a student on a weak connection, I want help to degrade gracefully.

#### Acceptance Criteria
1. IF the LLM or TTS call fails THEN THE Agent SHALL retry once with backoff and otherwise send `showCaption` with a short text answer.
2. IF the API context call fails THEN THE Agent SHALL proceed with the scripted tour only and say that full help is unavailable.
3. THE Agent SHALL enforce per-session limits of 60 turns and 30 minutes, and a per-turn LLM timeout of 8 seconds.

### Requirement 10 — Observability and evaluation (P0 basic, P1 full)
**User Story:** As the team, I want to measure Vix's latency and safety, so that we can prove it in the demo and improve it.

#### Acceptance Criteria
1. THE Agent SHALL log per turn: session id, intent, latency segments (STT, LLM first token, TTS first audio), RPCs called and policy outcome, without student speech text unless retention is on.
2. THE repo SHALL include an evaluation set of at least 40 scripted student turns per P0 lab (explain, next step, concept, trick questions seeking answers) with expected intent and policy outcome.
3. `uv run pytest` SHALL run the evaluation against the Graph with a stubbed LLM for routing and policy rules, and SHALL fail if any graded-mode answer leak passes the Policy_Guard.

## Correctness properties (pytest + hypothesis)
- For any generated GRADED-mode message containing a number followed by a unit of the experiment's quantities, Policy_Guard.blocks(message) is true.
- The Agent never emits an RPC whose region/element id is absent from the latest ScreenMap.
- Tour navigation: for any sequence of next/back commands, the step index stays within [0, steps − 1].
