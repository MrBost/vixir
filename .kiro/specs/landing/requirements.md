# Requirements Document

## Introduction
**Feature:** Landing page (A1)

Public homepage. Explains the problem, how a Vixir practical works, the labs, who it is for, and that Vixir is free and open source. No pricing anywhere.

## Glossary
- **Landing_Page**: the public A1 homepage.
- **Platform**: the web app plus the API.

## Requirements

### Requirement 1 — Explain Vixir in one screen
**User Story:** As a visiting teacher or judge, I want to understand Vixir in seconds.

#### Acceptance Criteria
1. THE Landing_Page SHALL show a headline, one-sentence description, "Get started free" and "Try the pendulum lab" actions above the fold.
2. THE Landing_Page SHALL include sections: the problem, how a practical works (4 steps), the labs (physics, chemistry, biology, electronics, engineering), who it is for, offline support, and open source.
3. THE Landing_Page SHALL link to the public GitHub repository and the contribution guide.
4. THE Landing_Page SHALL NOT show prices or paid plans.
5. WHEN "Try the pendulum lab" is chosen THE Platform SHALL open a practice Attempt without sign-in.
6. THE Landing_Page SHALL score 90 or more on Lighthouse accessibility and performance on mobile.
