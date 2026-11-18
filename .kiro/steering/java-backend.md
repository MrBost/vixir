---
inclusion: fileMatch
fileMatchPattern: "apps/api/**"
---
# Java backend rules (apps/api)

- Java 21 LTS, Spring Boot 3.5.16, Gradle Kotlin DSL (wrapper 8.14.3). Package root `org.vixir`, packaged by feature (auth, school, assignment, marking, experiment, vix, common), not by layer.
- REST under `/api/v1`, JSON, documented with springdoc OpenAPI; the web app's TS client is generated from `/v3/api-docs` (openapi-typescript).
- Use Java records for DTOs; never expose JPA entities from controllers. Validate inputs with Bean Validation; return RFC 9457 problem details on errors.
- Spring Security: stateless JWT (resource server) + Google OAuth2 login; roles STUDENT, TEACHER, ADMIN; authorization with @PreAuthorize on services so a student only reaches their own attempts.
- Persistence: Spring Data JPA + PostgreSQL; schema only through Flyway migrations (`db/migration/V{n}__desc.sql`); demo seed under the `demo` profile.
- Marking (`org.vixir.marking`) is pure Java with no Spring or DB dependencies inside the evaluator, so it can be property-tested with jqwik and checked against `packages/marking-fixtures` JSON vectors.
- Experiment configs are read from `packages/experiments` and validated against `experiment.schema.json` at startup; fail fast if invalid.
- Event logs arrive in batches (`POST /api/v1/attempts/{id}/events`), idempotent by client event id, so offline sync can retry safely.
- LiveKit: issue room tokens with the LiveKit Java server SDK; room = attempt id; never issue a token for an exam-mode attempt.
- Tests: JUnit 5, jqwik for properties, Testcontainers Postgres for repository/integration tests, MockMvc for controllers. `./gradlew test` must pass before a task is marked done.
- Config via env vars only (`VIXIR_DB_URL`, `VIXIR_JWT_SECRET`, `GOOGLE_CLIENT_ID`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `ANTHROPIC_API_KEY` is used by the agent, not the API).
