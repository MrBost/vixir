# Vixir — open-source virtual practical laboratory

Browser-based practical labs (physics, chemistry, biology, electronics, engineering) for schools that can't afford fully equipped labs. Built for Kiroween 2026. MIT licensed.

## Repo layout

| Path | What | Owner |
|---|---|---|
| `apps/web` | React + Vite + TypeScript PWA (all screens A1–I2) | Frontend |
| `apps/api` | Java 21 + Spring Boot 3.5 API, Postgres, Flyway | Backend |
| `apps/vix-agent` | Python LiveKit Agents + LangGraph voice guide | Shared |
| `packages/sim-core` | Seeded RNG, instruments, models, regression (+ property tests) | Frontend |
| `packages/experiments` | Experiment JSON configs + schema (read by web **and** API) | Both |
| `packages/screen-map` | Vix ScreenMap + RPC types | Frontend |
| `packages/ui` | Design tokens | Frontend |
| `packages/marking-fixtures` | Shared marking test vectors (Java marker = TS preview) | Both |
| `.kiro/` | Steering + specs — **must stay committed** (Kiroween rule) | Both |

## Run it locally

Prerequisites: Node 22 + pnpm 10, Java 21, Docker, and (for the agent) Python 3.12 + uv.

```bash
cp .env.example .env
pnpm install
docker compose up -d db          # Postgres on :5432
cd apps/api && ./gradlew bootRun # API on :8080  → http://localhost:8080/api/v1/ping
pnpm dev                         # web on :5173 (from the repo root, in another terminal)
cd apps/vix-agent && uv sync && uv run pytest
```

Everything in Docker instead: `docker compose up --build` (Postgres + API). School-server mode (also serves the web app on :8081): `docker compose --profile school up -d --build`.

## Checks (same as CI)

```bash
pnpm turbo run typecheck test build    # web + packages, incl. fast-check property tests
pnpm validate:experiments              # experiment configs vs schema
cd apps/api && ./gradlew build         # Java: jqwik properties + Testcontainers integration tests
cd apps/vix-agent && uv run ruff check . && uv run pytest
```

## Team workflow (2 people)

- `main` is always deployable. Protect it: GitHub → Settings → Branches → require PR + passing **CI**.
- Branch names: `fe/<screen-or-feature>` (frontend), `be/<feature>` (backend), e.g. `fe/d1-pendulum-lab`, `be/auth-refresh`.
- One spec task per PR where possible; write the spec + task in the PR description.
- Shapes shared between web and API live in `.kiro/steering/contracts.md` and `data-model.md`. Change those **first**, in their own small PR, and tag the other person.
- Fill in `.github/CODEOWNERS` with your usernames so reviews are requested automatically.

## CI/CD

| Workflow | When | Does |
|---|---|---|
| `ci.yml` | every PR and push to main | Runs only the jobs whose paths changed: web/packages, API, agent; checks `.kiro` is committed |
| `deploy-api.yml` | push to main touching the API | Builds the API image → GHCR → triggers Render deploy hook |
| `deploy-agent.yml` | manual | Builds the agent image → GHCR |
| Vercel (no workflow) | every push / PR | Builds `apps/web`; production on main, preview URL on each PR |

### One-time hosting setup (all have free tiers)

1. **Database — Neon:** create a project, copy the JDBC URL, user and password.
2. **API — Render:** New → Web Service → "Deploy an existing image" → `ghcr.io/<you>/<repo>/api:latest` (make the GHCR package public, or add registry credentials). Env vars: everything under "API" in `.env.example`, with `VIXIR_WEB_ORIGINS` set to your Vercel URL. Copy the service's **Deploy Hook** URL into GitHub → Settings → Secrets → Actions as `RENDER_DEPLOY_HOOK_URL`. Health check path: `/actuator/health`.
3. **Web — Vercel:** import the repo, Root Directory `apps/web`, framework Vite, build command `cd ../.. && pnpm turbo run build --filter=@vixir/web`, output `dist`, install command `cd ../.. && pnpm install`. Env var `VITE_API_URL` = your Render URL.
4. **Vix — LiveKit Cloud:** create a project; put `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` in Render (the API issues tokens) and in the agent's host. Deploy the agent image from `deploy-agent.yml` following LiveKit's current agent-deployment docs.

## Kiro

Start with `.kiro/README.md`. Log meaningful Kiro use in `KIRO_LOG.md` as you go — it becomes the submission write-up.
