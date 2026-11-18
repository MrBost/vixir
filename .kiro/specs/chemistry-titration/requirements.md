# Requirements Document

## Introduction
**Feature:** Chemistry: acid–base titration

Titration of hydrochloric acid (in the burette, unknown concentration) against 25.0 cm³ of 0.100 mol dm⁻³ sodium hydroxide (screens C1 pre-lab, D2 lab). The student titrates to the end point, records rough and accurate titres until two are concordant, and calculates the acid's concentration.

## Glossary
- **Titration_Lab**: the D2 lab workspace.
- **PreLab_Check**: the C1 safety and readiness screen.
- **Titre**: final burette reading − initial burette reading.
- **Concordant**: two accurate titres within 0.10 cm³.

## Requirements

### Requirement 1 — Safety before entry
**User Story:** As a teacher, I want students to complete a safety check, so that they learn real lab safety habits.

#### Acceptance Criteria
1. THE PreLab_Check SHALL require lab coat, goggles and gloves to be marked on, the hazards to be acknowledged, and the quick-check questions answered correctly.
2. WHILE any of those is incomplete THE PreLab_Check SHALL keep "Enter the lab" disabled.
3. WHEN a quick-check answer is wrong THE PreLab_Check SHALL explain why without revealing the answer to the other question.

### Requirement 2 — Burette control
**User Story:** As a student, I want to control the tap like a real burette, so that I learn to slow down near the end point.

#### Acceptance Criteria
1. THE Titration_Lab SHALL offer tap settings Closed, Dropwise (0.05 cm³/s), Slow (0.35 cm³/s) and Fast (1.4 cm³/s).
2. WHILE the tap is open THE Titration_Lab SHALL add acid at that rate, lower the burette liquid level and animate drops.
3. THE Titration_Lab SHALL display the burette reading rounded to the nearest 0.05 cm³ and a magnified meniscus view.

### Requirement 3 — Chemistry and indicator
**User Story:** As a student, I want the flask to change colour exactly as it would in a real titration, so that I learn to judge the end point.

#### Acceptance Criteria
1. THE Titration_Lab SHALL compute pH from moles of acid and base added and total volume, using the hidden acid concentration from the seed.
2. WHERE the indicator is phenolphthalein THE Titration_Lab SHALL show pink above pH 8.2 fading to colourless below it.
3. WHERE the indicator is methyl orange THE Titration_Lab SHALL show yellow above pH 4.4, orange from 3.1 to 4.4, and red below 3.1.
4. WHEN acid is added and the flask has not been swirled THE Titration_Lab SHALL show a local colour streak and a "swirl the flask" warning.
5. WHEN the volume added passes the equivalence point by more than 0.10 cm³ THE Titration_Lab SHALL log an overshoot warning for that titration.

### Requirement 4 — Titration table
**User Story:** As a student, I want my titres tabulated and checked for concordance, so that I know when to stop.

#### Acceptance Criteria
1. WHEN the student records a final reading THE Titration_Lab SHALL add a row with initial, final and titre, labelled Rough for the first.
2. WHEN the last two accurate titres are within 0.10 cm³ THE Titration_Lab SHALL mark them concordant and show their mean.
3. WHEN the student starts a new titration THE Titration_Lab SHALL refill the burette with a new initial reading and a fresh 25.0 cm³ of base.
4. WHILE the Mode is practice THE Titration_Lab SHALL show a pH readout and live pH curve; WHILE graded it SHALL hide them.

## Correctness properties
- pH is non-increasing as acid volume increases.
- pH = 7 ± 0.5 at the equivalence volume Ve = 25.0 × 0.100 / C_acid.
- Displayed reading is always a multiple of 0.05.
