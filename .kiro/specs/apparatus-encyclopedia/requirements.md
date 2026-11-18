# Requirements Document

## Introduction
**Feature:** Apparatus encyclopedia (P1)

Isometric, labelled drawings of real apparatus (B5) so students recognise and handle real equipment correctly.

## Glossary
- **Apparatus_Page**: the B5 screen listing real lab equipment.
- **Item**: one piece of apparatus with an isometric SVG drawing, parts, handling steps and common mistakes.

## Requirements

### Requirement 1 — Know the real equipment
**User Story:** As a student who has never seen the apparatus, I want to recognise it and know how to handle it.
#### Acceptance Criteria
1. THE Apparatus_Page SHALL list at least: retort stand, burette, conical flask, beaker, volumetric pipette, metre rule, analogue voltmeter, rheostat, dial gauge, vernier caliper.
2. WHEN an item is selected THE Apparatus_Page SHALL show its isometric drawing with labelled parts, how to handle it, mistakes examiners look for, and how to spot it in a real lab.
3. THE Apparatus_Page SHALL filter items by lab.
4. THE Apparatus_Page SHALL link each item to a practical that uses it.
5. THE Apparatus_Page SHALL store drawings as SVG assets in `apps/web/public/apparatus/` so they work offline.
