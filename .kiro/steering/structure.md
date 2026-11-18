---
inclusion: always
---
# Repository structure

```
vixir/
├── .kiro/                    steering, specs, hooks (committed — required by Kiroween rules)
├── apps/
│   ├── web/                  React PWA
│   │   └── src/
│   │       ├── routes/       one folder per screen code (see map below)
│   │       ├── labs/         one folder per lab: physics-pendulum/, chemistry-titration/, biology-digestion/ …
│   │       ├── lab-shell/    shared workspace layout + panels
│   │       ├── vix/          Vix client: LiveKit room, RPC handlers, spotlight overlay
│   │       └── i18n/
│   ├── api/                  Java 21 + Spring Boot backend (Gradle)
│   │   └── src/main/java/org/vixir/
│   │       ├── auth/         security config, JWT, Google OAuth2, roles
│   │       ├── school/       institutions, classes, enrolments, join codes
│   │       ├── assignment/   assignments, attempts, event log ingest
│   │       ├── marking/      rubric evaluator (authoritative marking)
│   │       ├── experiment/   loads packages/experiments JSON configs
│   │       ├── vix/          LiveKit token endpoint, consent settings
│   │       └── common/       errors, OpenAPI, validation
│   │   └── src/main/resources/db/migration/   Flyway V1__*.sql …
│   └── vix-agent/            Python LiveKit + LangGraph worker
├── packages/
│   ├── sim-core/             rng, instruments, models, regression, units
│   ├── experiments/          experiment JSON configs + experiment.schema.json
│   ├── marking-fixtures/     shared JSON test vectors: same inputs → same marks in TS preview and Java marker
│   ├── screen-map/           vixRegion() registry + map publisher
│   └── ui/                   tokens + shared components
├── docker-compose.yml        postgres + api + web (also the offline school-server bundle)
├── LICENSE (MIT) · README.md · KIRO_LOG.md
```

## Screen code → route map (designs on the Vixir canvas)
| Code | Screen | Route |
|---|---|---|
| A1 | Landing | `/` |
| A2 | Sign in / sign up | `/auth` |
| B1 | Student dashboard | `/app` |
| B2 | Labs hub | `/app/labs` |
| B3 | Experiment library | `/app/library` |
| B4 | Experiment briefing | `/app/x/:experimentId` |
| B5 | Apparatus encyclopedia | `/app/apparatus` |
| C1 | Pre-lab safety check | `/app/x/:id/prelab` |
| C2 | Apparatus setup | `/app/x/:id/setup` |
| C3 | Exam mode start | `/app/x/:id/exam` |
| D1–D7 | Lab workspaces | `/app/x/:id/lab` |
| E1 | Call Vix | overlay `?vix=connect` |
| E2 | Vix tour | overlay on any lab |
| F1 | Results & graph | `/app/x/:id/results` |
| F2 | Review & submit | `/app/x/:id/submit` |
| F3 | Marked report | `/app/attempts/:attemptId` |
| F4 | Bench replay | `/app/attempts/:attemptId/replay` |
| G1–G4 | Teacher | `/teach`, `/teach/assign`, `/teach/classes/:id`, `/teach/builder` |
| H1 | Admin | `/admin` |
