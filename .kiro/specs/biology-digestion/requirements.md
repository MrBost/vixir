# Requirements Document

## Introduction
**Feature:** Biology: the journey of food (digestive system)

An animated model of the human digestive system (screen D3). The student feeds the model a food, watches it move through each organ, and sees which enzymes act on it, with absorption shown at villus level. P0 is a learning model (practice mode, no marking).

## Glossary
- **Digestion_Lab**: the D3 workspace.
- **Bolus**: the food item animated through the tract.
- **Stage**: mouth, oesophagus, stomach, small intestine, large intestine, rectum & anus.

## Requirements

### Requirement 1 — Animated journey
**User Story:** As a student without access to models or specimens, I want to watch food move through the body, so that I understand the order and purpose of each organ.

#### Acceptance Criteria
1. WHEN playback is running THE Digestion_Lab SHALL move the Bolus along the tract through every Stage in order.
2. WHILE the Bolus is in the oesophagus THE Digestion_Lab SHALL animate peristaltic waves travelling toward the stomach.
3. WHILE the Bolus is in the stomach THE Digestion_Lab SHALL animate churning.
4. THE Digestion_Lab SHALL highlight the current organ and its name in the organ list.
5. THE Digestion_Lab SHALL offer play/pause, restart, speed ×1, ×2, ×4 and jump-to-organ.

### Requirement 2 — Food-specific chemistry
**User Story:** As a student, I want to see which enzymes digest which food, so that I can answer exam questions about enzymes and products.

#### Acceptance Criteria
1. THE Digestion_Lab SHALL offer at least bread (starch), beans (protein) and groundnut oil (fat).
2. WHEN a food is selected THE Digestion_Lab SHALL show, at each Stage, only the enzymes or juices that act on that food, with substrate and product.
3. THE Digestion_Lab SHALL show the typical pH and movement type for each Stage.
4. WHILE the Bolus is in the small intestine THE Digestion_Lab SHALL show a magnified villus with nutrients moving into the capillary and the lacteal.

### Requirement 3 — Check understanding
**User Story:** As a student, I want a question at each stage, so that I check I understood rather than just watched.

#### Acceptance Criteria
1. THE Digestion_Lab SHALL show one "check yourself" question for each Stage.
2. WHERE the user prefers reduced motion THE Digestion_Lab SHALL replace continuous animation with step-by-step stage views.

## Content accuracy
All biology content (enzymes, pH ranges, times) must be reviewed against a WAEC Biology syllabus source before demo; record the source in the experiment config.
