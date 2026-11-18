# Requirements Document

## Introduction
**Feature:** Vix, the voice and vision lab guide

Vix is an AI lab guide the student can call from any lab (E1 connect, E2 tour). It sees a live semantic map of the screen (and optionally screen-share frames), talks through LiveKit, and can spotlight or point at parts of the screen. Built with LiveKit Agents + LangGraph in `apps/vix-agent`; client in `apps/web/src/vix` and `packages/screen-map`. Architecture notes: project doc `claude/vix-agent-architecture.md`.

## Glossary
- **Vix_Agent**: the Python worker (LiveKit Agents + LangGraph).
- **Vix_Client**: the web client that joins the LiveKit room and handles RPCs.
- **Screen_Map**: JSON snapshot of visible regions (`data-vix-id`, label, bounding box, summary), simulation state and Mode.
- **Spotlight**: overlay that dims everything but one region and rings it.
- **Scripted_Tour**: pre-written step list per screen, playable without the agent.

## Requirements

### Requirement 1 — Calling Vix with consent
**User Story:** As a student, I want to choose what Vix can use before it starts, so that I stay in control.

#### Acceptance Criteria
1. WHEN the student presses Call Vix THE Vix_Client SHALL show the connect screen with microphone, lab-screen sharing and camera toggles (camera off by default) and a voice choice.
2. WHEN the student confirms THE Vix_Client SHALL request a scoped LiveKit token from the API and join a room named for the Attempt.
3. THE Vix_Client SHALL share only the Vixir lab view, never other tabs or applications.
4. WHILE the Mode is exam THE Vix_Client SHALL not offer Call Vix.

### Requirement 2 — Explaining the screen
**User Story:** As a student who has never used a lab, I want Vix to walk me through the screen, so that I know what each part is for.

#### Acceptance Criteria
1. WHEN the student says or taps "Explain this screen" THE Vix_Agent SHALL plan a tour from the visible Screen_Map regions and narrate one region at a time.
2. WHEN Vix narrates a region THE Vix_Client SHALL Spotlight that region and show captions of the speech.
3. THE Vix_Client SHALL offer Back, Say again and Next during a tour.
4. WHEN the student asks about a named part ("what is this orange ball?") THE Vix_Agent SHALL resolve it from the Screen_Map, or from a screen frame if ambiguous, and point at it.
5. WHEN the student asks "what should I do next?" THE Vix_Agent SHALL compare simulation state to the procedure and give the next step as a hint.

### Requirement 3 — Mode-aware guardrails
**User Story:** As a teacher, I want Vix to help without doing the work, so that graded results stay honest.

#### Acceptance Criteria
1. WHILE the Mode is graded THE Vix_Agent SHALL NOT state readings, derived values, slopes or whether a specific answer is correct.
2. WHILE the Mode is graded THE Vix_Client SHALL redact numeric values from the Screen_Map before sending it.
3. THE Vix_Agent SHALL pass every outgoing message through a policy check before speaking it.
4. THE Vix_Agent SHALL only act on the screen through the whitelisted RPCs spotlight, pointAt, startTour, endTour, openPanel and showCaption.
5. IF a message from the agent asks for any other action THEN THE Vix_Client SHALL ignore it and log it.

### Requirement 4 — Reliability and fallback
**User Story:** As a student on weak internet, I want help even when the AI can't connect, so that I'm never stuck.

#### Acceptance Criteria
1. IF the Vix_Client cannot reach the agent within 8 seconds THEN THE Vix_Client SHALL play the Scripted_Tour with browser speech synthesis.
2. THE Vix_Agent SHALL begin speaking within 1.2 seconds of the end of the student's speech on a normal connection (p50).
3. WHEN the call ends THE Vix_Client SHALL remove all overlays and release the microphone.

### Requirement 5 — Language and accessibility
**User Story:** As a student more comfortable in another language, I want captions and speech I can follow.

#### Acceptance Criteria
1. THE Vix_Client SHALL show captions for everything Vix says.
2. THE Vix_Client SHALL let the student type instead of speaking.
3. WHERE a non-English language is selected and the voice provider supports it THE Vix_Agent SHALL respond in that language.
