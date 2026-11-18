# Requirements Document

## Introduction
**Feature:** Physics: simple pendulum (determination of g)

The WAEC/NECO-style simple pendulum practical (screens B4 briefing, C2 setup, D1 lab). The student assembles the rig, sets six lengths, times 20 oscillations at each with a manual stopwatch, and determines g from the slope of T² against L.

## Glossary
- **Pendulum_Lab**: the D1 lab workspace for this experiment.
- **Setup_Step**: the C2 apparatus assembly step.
- **Oscillation_Counter**: on-screen count of complete oscillations since the stopwatch started.

## Requirements

### Requirement 1 — Assemble the apparatus
**User Story:** As a student, I want to set up the apparatus in a sensible order, so that I learn how the real rig is built.

#### Acceptance Criteria
1. THE Setup_Step SHALL offer retort stand, boss & clamp, split cork, string + bob, metre rule, plumb line and stopwatch.
2. IF the student places an item before an item it depends on THEN THE Setup_Step SHALL refuse the placement and explain which item is needed first.
3. WHEN all items are placed THE Setup_Step SHALL enable "Take readings" and log the order of placement.

### Requirement 2 — Realistic swing
**User Story:** As a student, I want the pendulum to swing like a real one, so that what I time is meaningful.

#### Acceptance Criteria
1. THE Pendulum_Lab SHALL compute the period as T = 2π√(L/g)·(1 + θ₀²/16) with the hidden local g from the seed.
2. WHEN the student releases the bob THE Pendulum_Lab SHALL animate the swing with slow amplitude decay.
3. WHEN θ₀ exceeds 10° THE Pendulum_Lab SHALL show a warning that the small-angle formula no longer holds.
4. WHEN the student changes L THE Pendulum_Lab SHALL stop the bob and require a new release.

### Requirement 3 — Manual timing
**User Story:** As a student, I want to start and stop the stopwatch myself, so that I experience reaction-time error.

#### Acceptance Criteria
1. WHEN the student presses Start THE Pendulum_Lab SHALL start the stopwatch and the Oscillation_Counter.
2. WHEN the student presses Stop THE Pendulum_Lab SHALL freeze the displayed time, including the stopwatch's reaction error.
3. WHEN the student records a reading whose counted oscillations are not 20 THE Pendulum_Lab SHALL record it with a warning flag on that row and in the Event_Log.
4. WHILE the eye-level toggle is off THE Pendulum_Lab SHALL show the length reading with parallax and a warning badge.

### Requirement 4 — Readings and live preview
**User Story:** As a student, I want my readings tabulated with a live graph, so that I spot bad points before analysing.

#### Acceptance Criteria
1. WHEN a reading is recorded THE Pendulum_Lab SHALL add a row with L, t, n, T and T² to the Readings tab.
2. THE Pendulum_Lab SHALL plot each row on a live T² against L preview.
3. WHEN six or more distinct lengths are recorded THE Pendulum_Lab SHALL enable "Analyse results".

## Correctness properties
- T increases strictly with L for fixed θ₀.
- T² / L is within 1% of 4π²/g for θ₀ ≤ 5°.
- For the same seed and actions, recorded rows are identical.
