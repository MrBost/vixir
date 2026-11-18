# Requirements Document

## Introduction
**Feature:** Engineering: deflection of a simply supported beam (P1)

Isometric test rig (D7): beam on knife edges, load hanger with 100 g slotted masses, dial gauge on a magnetic stand. Student loads and unloads, records deflection and finds Young's modulus E.

## Glossary
- **Beam_Lab**: the D7 lab workspace.
- **Dial_Gauge**: instrument reading mid-span deflection to 0.01 mm.
- **Deflection (δ)**: downward movement of the beam's mid-point under load.

## Requirements

### Requirement 1 — Rig and views
**User Story:** As an engineering student without a rig, I want a realistic 3D-style view, so that I recognise the real apparatus.
#### Acceptance Criteria
1. THE Beam_Lab SHALL draw the rig in isometric view with labelled parts (frame, knife edges, beam, hanger, masses, magnetic stand, dial gauge) and offer a front-elevation view.
2. THE Beam_Lab SHALL let the student choose material (mild steel, brass, aluminium) and span (0.6, 0.8, 1.0 m).
3. WHEN masses are added THE Beam_Lab SHALL bend the beam visibly using the simply supported deflection curve, magnified and labelled as magnified.

### Requirement 2 — Measurement
**User Story:** As a student, I want the dial gauge to behave like a real one.
#### Acceptance Criteria
1. THE Beam_Lab SHALL compute mid-span deflection δ = W L³ / (48 E I) with hidden E from the seed.
2. WHEN load changes THE Beam_Lab SHALL animate the needle overshooting and settling, and warn if a reading is taken before it settles.
3. IF the gauge is not zeroed after mounting a beam THEN THE Beam_Lab SHALL add a zero error to readings.
4. THE Beam_Lab SHALL record loading and unloading deflections per load and show their mean.
5. THE Beam_Lab SHALL show a live δ against W preview and E from the slope.
## Correctness properties
- δ is linear in W and proportional to L³ (within noise bounds).
