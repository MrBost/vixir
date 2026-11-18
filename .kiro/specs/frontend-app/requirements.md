# Requirements Document

## Introduction
**Feature:** Frontend web app (React PWA)

`apps/web` is the React + Vite + TypeScript progressive web app for students, teachers and admins. It implements every screen on the Vixir canvas (codes A1–I2, route map in steering `structure.md`), talks to the Java API through a client generated from its OpenAPI spec, runs the lab simulations locally via `packages/sim-core`, and hosts the Vix client. Lab behaviour lives in the lab specs (`lab-shell`, `physics-pendulum`, `chemistry-titration`, `biology-digestion`, `engineering-beam`, `electronics-ohms-law`); Vix client behaviour in `vix-guide`. This spec covers everything else the frontend must do.

## Glossary
- **App**: the web application in `apps/web`.
- **API_Client**: TypeScript client generated from `/v3/api-docs` with openapi-typescript + a thin fetch wrapper.
- **Session**: the signed-in user's access token (memory only) + refresh cookie.
- **Screen code**: canvas code A1–I2 used for routes, tests and Vix tours.
- **Outbox**: IndexedDB queue of unsent events and submissions.

## Requirements

### Requirement 1 — App shell, routing and layouts (P0)
**User Story:** As any user, I want predictable navigation, so that I always know where I am.

#### Acceptance Criteria
1. THE App SHALL implement routes for every screen code using the route map in `structure.md`, with lazy-loaded route chunks.
2. THE App SHALL provide three layouts: public (A1, A2), student/teacher/admin app shell with sidebar (B, F, G, H screens), and full-screen lab (C2, D1–D7).
3. WHEN a signed-out user opens a protected route THE App SHALL redirect to `/auth?next=<route>` and return there after sign-in.
4. WHEN a user opens a route their role cannot use THE App SHALL show a not-found page, not an error.
5. THE App SHALL set the document title per screen and move focus to the main heading after navigation.
6. THE initial JavaScript for the landing page SHALL be under 150 KB gzipped, and for the lab route under 400 KB gzipped.

### Requirement 2 — Authentication (P0)
**User Story:** As a user, I want to sign in once and stay signed in safely.

#### Acceptance Criteria
1. THE App SHALL keep the access token in memory only, never in localStorage.
2. WHEN an API call returns 401 THE API_Client SHALL call `/auth/refresh` once, retry the request, and on failure sign the user out.
3. THE A2 screen SHALL offer Sign in and Create account tabs, role choice (Student, Teacher, Admin) with role-specific code fields, Google sign-in, show-password, and inline field errors from the API's problem details.
4. WHEN sign-in succeeds THE App SHALL route students to B1, teachers to G1 and admins to H1.

### Requirement 3 — Data access and errors (P0)
**User Story:** As a user, I want clear feedback when something is loading or fails.

#### Acceptance Criteria
1. THE App SHALL fetch and cache server data with TanStack Query; mutations SHALL invalidate the affected queries.
2. EVERY data view SHALL have loading (skeleton), empty (message + next action) and error (problem `title` + retry) states.
3. WHEN the API returns a problem with `code` THE App SHALL show the human message for that code from `i18n/en.json`.
4. THE App SHALL send `X-Request-Id` on every request and show it in error details for support.

### Requirement 4 — Design system and accessibility (P0)
**User Story:** As a student on any device or with any ability, I want a clear, usable interface.

#### Acceptance Criteria
1. THE App SHALL use the tokens and fonts in steering `ui-design.md` through `packages/ui`, with shadcn/ui primitives.
2. THE App SHALL meet WCAG 2.2 AA: 4.5:1 text contrast, visible focus, labels on every input, aria-label on icon buttons, keyboard access to every control including lab controls.
3. THE App SHALL lay out every screen without horizontal scrolling from 360 px to 1920 px wide.
4. WHERE the user prefers reduced motion THE App SHALL pause decorative and lab animations and show static states.
5. THE App SHALL load every string from `i18n/<locale>.json`; English is complete for P0.
6. Automated axe checks in Playwright SHALL report zero serious violations on every P0 screen.

### Requirement 5 — Public screens (P0)
**User Story:** As a visitor or judge, I want to understand and try Vixir immediately.

#### Acceptance Criteria
1. THE A1 landing page SHALL implement the sections in spec `landing` and SHALL show no pricing.
2. WHEN a visitor chooses "Try the pendulum lab" THE App SHALL create an anonymous practice attempt and open D1 without sign-in.

### Requirement 6 — Student screens (P0)
**User Story:** As a student, I want to see what is due, pick a practical and prepare for it.

#### Acceptance Criteria
1. THE B1 dashboard SHALL show greeting, class, due-this-week assignment cards with progress and Continue/Open actions, recent results, practical-skills bars and a sync status.
2. THE B2 labs hub SHALL show a resume card for the latest in-progress attempt and one card per lab (Physics, Chemistry, Biology, Electronics, Engineering) listing its experiments with status (Assigned, Done, New, Offline).
3. THE B3 library SHALL filter experiments by subject and curriculum and open B4 for the chosen experiment.
4. THE B4 briefing SHALL show aim, apparatus, theory formulae, procedure, precautions, assignment details (setter, due, attempts, marks), the marking breakdown, Enter the lab and Practice mode actions.
5. (P1) THE B5 apparatus encyclopedia SHALL implement spec `apparatus-encyclopedia`.

### Requirement 7 — Before the bench (P0 C1, C2; P2 C3)
**User Story:** As a student, I want to be safe and set up properly before I start.

#### Acceptance Criteria
1. WHERE an experiment declares hazards THE App SHALL show C1 before the lab and keep Enter disabled until PPE, hazards and quick-check are complete; the completion SHALL be logged as an attempt event.
2. WHERE an experiment declares a setup step THE App SHALL show C2 and log the placement order.
3. (P2) WHEN an assignment's mode is EXAM THE App SHALL show C3 (rules, four confirmations, candidate number, countdown) and enter full screen; leaving full screen SHALL be logged.

### Requirement 8 — Lab workspaces (P0 D1–D3, P1 D6–D7, P2 D4–D5)
**User Story:** As a student, I want the lab to run smoothly and never lose my work.

#### Acceptance Criteria
1. WHEN D-screens load THE App SHALL bootstrap the attempt from the API (contracts §2), derive hidden values from the seed in sim-core, and restore state by replaying resume events.
2. THE App SHALL record every bench action as an AttemptEvent with a gapless seq, store it in the Outbox, and upload batches every 5 seconds and on leaving the page.
3. IF an upload fails THEN THE App SHALL keep events in the Outbox and retry with exponential backoff up to 60 seconds.
4. THE App SHALL show sync state in the lab header (Saved · Saving · Offline — n unsent).
5. THE App SHALL implement each lab per its spec, inside the `lab-shell` layout.

### Requirement 9 — After the bench (P0 F1–F3, P2 F4)
**User Story:** As a student, I want to analyse my results, check them and see my marks with reasons.

#### Acceptance Criteria
1. THE F1 screen SHALL show the results table (measured columns read-only, derived editable with inline checks), the graph with axis choice and best-fit/slope-triangle tools, the calculation panel and precautions.
2. THE F2 screen SHALL list each rubric criterion as OK or warning with a Fix link, require the declaration, and submit with an Idempotency-Key.
3. WHEN submitted THE App SHALL show the confirmation with submission ID, then poll the report every 3 seconds for up to 60 seconds.
4. THE F3 report SHALL show total with grade ring, each criterion with marks and reason, the teacher comment, Vix viva questions and links to the submission.
5. (P2) THE F4 bench replay SHALL replay attempt events on a timeline with play, scrub and flagged moments.

### Requirement 10 — Vix client (P0)
**User Story:** As a student, I want to call Vix from anywhere in a lab.

#### Acceptance Criteria
1. THE App SHALL implement spec `vix-guide`: E1 connect screen and E2 spotlight tour overlay, using `livekit-client` and `@livekit/components-react`.
2. THE App SHALL register every lab region with `vixRegion(id, label, kind)` from `packages/screen-map` and publish the ScreenMap per contracts §4, redacting numbers in GRADED mode.
3. THE App SHALL register handlers only for the RPCs in contracts §5 and reject ids absent from the current ScreenMap.
4. IF the session request fails or the agent does not join within 8 seconds THEN THE App SHALL play the scripted tour from `/vix/tours/{screenCode}` with `speechSynthesis`.

### Requirement 11 — Teacher screens (P0 G1–G3, P2 G4)
**User Story:** As a teacher, I want to assign work and act on results quickly.

#### Acceptance Criteria
1. THE G1 dashboard SHALL show KPI tiles (active assignments, awaiting review, average score, completion), active assignments with submission bars, common mistakes and my classes with join codes (copy button).
2. THE G2 assign screen SHALL let the teacher choose experiment, instructions, classes, opens/due times, attempts, mode (Practice/Graded/Exam), noise level, unique-values and replay toggles, release policy, with a live summary, Save draft and Publish.
3. THE G3 class results screen SHALL show score distribution, strip plot of derived values with the tolerance band, average by criterion, a student table with All / Needs review / Not submitted tabs, Review, Export CSV and Release marks.
4. WHEN a teacher overrides a criterion or adds a comment THE App SHALL save it and update totals without a page reload.
5. (P2) THE G4 experiment builder SHALL edit variables, instruments and noise, model and rubric, with a live JSON preview validated against the schema.

### Requirement 12 — Admin and mobile (P1 H1, I1, I2)
**User Story:** As an admin I want to manage my school; as a phone user I want a layout made for my screen.

#### Acceptance Criteria
1. THE H1 admin screen SHALL show people with search, CSV import with a per-row report, disable user, settings (Vix on/off, transcript retention, default noise, locale) and the usage overview.
2. WHEN the viewport is under 600 px THE App SHALL use the mobile layouts I1 (bottom tab bar, offline banner, due card, downloaded practicals) and I2 (compact lab with large controls).
3. THE App SHALL implement spec `offline-pwa` for install, download and sync.

### Requirement 13 — Quality gates (P0)
**User Story:** As the team, I want confidence that the demo works on the day.

#### Acceptance Criteria
1. Every P0 screen SHALL have a Playwright test that loads it with demo data and checks its main action.
2. The full student loop (sign in → B1 → B4 → D1 record 6 readings → F1 → F2 submit → F3 report) SHALL run as one Playwright test against the demo seed.
3. Lighthouse mobile scores SHALL be ≥ 90 for performance and accessibility on A1 and B1.
4. `pnpm lint`, `pnpm typecheck` and `pnpm test` SHALL pass before a task is marked done.
