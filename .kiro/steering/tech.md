---
inclusion: always
---
# Tech stack and conventions

## Stack
- Monorepo: pnpm workspaces + Turborepo. Node 22. TypeScript strict everywhere.
- Web: React 18 + Vite + TypeScript, React Router, Tailwind CSS, shadcn/ui (Radix). PWA via vite-plugin-pwa (Workbox).
- State: Zustand (local), TanStack Query (server). Forms: React Hook Form + Zod.
- Lab rendering: SVG in React driven by a requestAnimationFrame loop. No canvas/WebGL for P0.
- Simulation: `packages/sim-core` — pure TypeScript, no DOM, no Date.now / Math.random inside models (inject time and RNG).
- Backend: Java 21 LTS + Spring Boot 3.5.16 in `apps/api` (upgrade to 4.x after the hackathon), built with Gradle (Kotlin DSL). Spring Web (REST, OpenAPI via springdoc), Spring Security (JWT + Google OAuth2 login), Spring Data JPA + PostgreSQL, Flyway migrations, Bean Validation. Marking runs here (authoritative). LiveKit room tokens issued with the LiveKit Java server SDK. See java-backend.md.
- Vix agent: Python 3.12, LiveKit Agents, LangGraph, Claude API. Lives in `apps/vix-agent`.
- Tests: Vitest + fast-check (TS property tests); JUnit 5 + jqwik (Java property tests) + Testcontainers (Postgres) + MockMvc; Playwright for E2E; pytest for the agent.
- Lint/format: ESLint + Prettier (TS), Ruff (Python).

## Conventions
- Use named exports; one React component per file; files kebab-case, components PascalCase.
- Simulation models are pure functions: `(params, inputs, rng, t) => outputs`. Units in SI internally; convert only in the UI.
- Every reading shown to a student goes through an Instrument (resolution + noise) — never display a raw model value.
- All user-facing strings in `apps/web/src/i18n/en.json`.
- Accessibility: real <button>/<input>/<label>, aria-label on icon buttons, WCAG 2.2 AA contrast, 44 px touch targets, respect prefers-reduced-motion.
- Colours/typography come from design tokens in `packages/ui/tokens.ts` (Inter, Space Grotesk, JetBrains Mono).
- Secrets only via env vars; never commit keys. `.env.example` lists every variable.

## Commands
- `pnpm dev` — web app; `pnpm test` — all TS tests; `pnpm test:props` — TS property tests only
- `./gradlew bootRun` in apps/api — backend on :8080; `./gradlew test` — all Java tests incl. jqwik properties
- `docker compose up` — Postgres + api + web for local and school-server mode
- `pnpm --filter sim-core test`; `uv run pytest` in apps/vix-agent
