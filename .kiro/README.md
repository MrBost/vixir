# Vixir — Kiro workspace

Committed on purpose: Kiroween requires `/.kiro` at the repo root (do not add it to .gitignore).

## Steering (`steering/`)
Always on: product.md, tech.md, structure.md.
Scoped by file pattern: data-model.md (ERD — api, agent, web API client), contracts.md (REST, events, ScreenMap, Vix RPCs — all apps), java-backend.md (apps/api), simulation-realism.md (sim-core, experiments, labs), vix-safety.md (agent + Vix client), ui-design.md (web + ui).

## Specs (`specs/`)
Layer specs (build these in parallel, one owner each):
- backend-api — Java/Spring Boot: requirements.md + starting design.md (modules, endpoints, marking flow)
- vix-agent — Python LiveKit + LangGraph: requirements.md + starting design.md (graph, state, latency plan)
- frontend-app — React PWA: app-wide rules + every screen A1–I2

Feature specs (detail that the layer specs point to):
- P0: lab-shell, physics-pendulum, chemistry-titration, biology-digestion, vix-guide (Vix client UX), landing
- P1: offline-pwa, engineering-beam, electronics-ohms-law, apparatus-encyclopedia

Suggested order: backend-api Req 1–2, 4–8 and lab-shell first (days 1–4) → labs + frontend screens + vix-agent Req 1–4 → marking, teacher screens, policy guard → polish.

How to run a spec:
1. Open the spec in Kiro, review requirements.md, then ask Kiro to generate design.md.
2. Review design.md (check it states the correctness properties as fast-check tests), then generate tasks.md.
3. Run tasks one at a time; tick them off; log anything notable in KIRO_LOG.md.

## Suggested hooks (create in the Kiro Hooks panel)
- On save of `packages/sim-core/**` → run `pnpm --filter sim-core test`.
- On save of `apps/api/src/main/java/org/vixir/marking/**` → run `./gradlew test --tests '*Marking*'` (jqwik properties + fixtures).
- On save of `packages/experiments/**/*.json` → validate against `experiment.schema.json`.
- On new file in `apps/web/src/routes/**` → update the screen map table in README.md.
- On spec task completed → append a line to KIRO_LOG.md.

## Design references
Screens A1–I2: Vixir canvas (link in the team plan doc). Apparatus and lab illustrations: `apps/web/public/apparatus/`, `apps/web/public/illustrations/`.
