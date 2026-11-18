# Requirements Document

## Introduction
**Feature:** Lab shell and simulation core

The Lab_Shell is the shared workspace every lab runs inside (screens D1–D7). The Sim_Core is the pure TypeScript package that provides seeded randomness, instruments, the attempt event log and regression helpers. Build this first; every lab plugs into it.

## Glossary
- **Lab_Shell**: the React layout and panels shared by all lab workspaces.
- **Sim_Core**: `packages/sim-core`, pure functions with no DOM access.
- **Attempt**: one student's run of one experiment, identified by `attemptId`, with one `attemptSeed`.
- **Instrument**: a model of a measuring device with resolution, zero error, parallax and reaction error.
- **Event_Log**: ordered, timestamped list of student actions in an Attempt.
- **Experiment_Config**: JSON file in `packages/experiments` describing apparatus, variables, instruments, analysis and rubric.
- **Mode**: practice, graded or exam.

## Requirements

### Requirement 1 — Consistent workspace layout
**User Story:** As a student, I want every lab to look and work the same way, so that I can focus on the experiment instead of learning a new screen.

#### Acceptance Criteria
1. THE Lab_Shell SHALL render a header, tool rail, apparatus tray, bench, instrument dock, event log and data panel for every experiment.
2. THE Lab_Shell header SHALL show the experiment title, the Mode, the attempt number, a lab switcher for Physics, Chemistry, Biology, Electronics and Engineering, a Call Vix button and the next-step button.
3. WHEN the viewport is narrower than 900 px THE Lab_Shell SHALL stack the tray, bench, dock and data panel vertically without horizontal scrolling.
4. THE data panel SHALL offer Readings, Notebook and Assistant tabs.
5. WHILE the Mode is exam THE Lab_Shell SHALL hide the Assistant tab and the Call Vix button.

### Requirement 2 — Seeded, reproducible attempts
**User Story:** As a teacher, I want every student to get unique but reproducible data, so that copying is pointless and I can re-check any result.

#### Acceptance Criteria
1. WHEN an Attempt is created THE Platform SHALL generate a 128-bit attemptSeed and store it with the Attempt.
2. THE Sim_Core SHALL derive every hidden value and every noise sample for an Attempt from its attemptSeed through named RNG streams.
3. WHEN the same attemptSeed and the same ordered inputs are replayed THE Sim_Core SHALL return identical readings.
4. THE Sim_Core SHALL NOT call Math.random or Date.now inside models or instruments.

### Requirement 3 — Instruments behave like real ones
**User Story:** As a student, I want instruments to have real limitations, so that I learn to repeat, average and judge error like in a real lab.

#### Acceptance Criteria
1. THE Instrument SHALL round every returned reading to its configured resolution.
2. THE Instrument SHALL add its zero error to every reading until the student zeroes it, where zeroing is supported.
3. WHILE the student's eye-level flag is off THE Instrument SHALL add a parallax offset within its configured parallax bound.
4. WHEN the student starts and stops a timing instrument THE Instrument SHALL measure the simulated time between the two actions plus a reaction error drawn from its reactionSigma.
5. THE Lab_Shell SHALL never display a model's true value in graded or exam Mode.

### Requirement 4 — Event log
**User Story:** As a teacher, I want every bench action recorded, so that I can see how a student worked, not just their final numbers.

#### Acceptance Criteria
1. WHEN the student places apparatus, changes a control, starts or stops an instrument, or records a reading THE Lab_Shell SHALL append an event with type, payload and simulated and wall-clock timestamps.
2. THE Lab_Shell SHALL show the latest event in the log strip under the bench.
3. WHEN a warning condition occurs THE Lab_Shell SHALL log it with severity warning and show it as a badge on the bench.
4. THE Platform SHALL persist the Event_Log with the Attempt at least every 10 seconds and on submit.

### Requirement 5 — Experiment configs
**User Story:** As a contributor, I want to add an experiment by writing a config file, so that the library can grow without changing the shell.

#### Acceptance Criteria
1. THE Sim_Core SHALL validate every Experiment_Config against `experiment.schema.json` at build time.
2. IF an Experiment_Config fails validation THEN the build SHALL fail with the file name and the failing path.
3. THE Experiment_Config SHALL declare apparatus, variables (independent, measured, controlled, random), instruments, the model id, the analysis (plot axes, derived quantity, tolerance) and the rubric id.

### Requirement 6 — Simulation speed and motion
**User Story:** As a student on a slow phone, I want the bench to stay smooth, and as a student who gets dizzy, I want to stop animations.

#### Acceptance Criteria
1. THE Lab_Shell SHALL render bench animation at 30 frames per second or more on a 2 GB RAM Android phone.
2. WHILE the Mode is practice THE Lab_Shell SHALL offer speed ×1, ×2 and ×5; WHILE graded or exam it SHALL run at ×1 only.
3. WHERE the user prefers reduced motion THE Lab_Shell SHALL pause decorative animation and show static states.

## Correctness properties (for property-based tests)
- P1 Determinism: for any seed s and input list I, run(s, I) == run(s, I).
- P2 Resolution: every Instrument reading r satisfies r = round(r / resolution) × resolution.
- P3 Bounded error: |reading − trueValue| ≤ resolution/2 + |zeroError| + parallaxBound + 4·reactionSigma·rate.
- P4 Stream independence: drawing extra samples from stream A does not change samples from stream B.
