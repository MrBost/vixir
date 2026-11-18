---
inclusion: fileMatch
fileMatchPattern: "apps/api/**,apps/vix-agent/**,apps/web/**,packages/screen-map/**,packages/experiments/**"
---
# Shared contracts between web, API and Vix agent

Every layer must use these shapes exactly. Change them only in this file first, then in code.

## 1. REST conventions (apps/api)
- Base path `/api/v1`. JSON, camelCase. Times ISO-8601 UTC. IDs as strings.
- Auth: `Authorization: Bearer <access JWT>` (15 min). Refresh via httpOnly cookie `vx_refresh` (30 days, rotating).
- Errors: RFC 9457 `application/problem+json` → `{ type, title, status, detail, instance, code, errors?: [{field, message}] }`. `code` is a stable UPPER_SNAKE value (e.g. `CLASS_CODE_INVALID`, `ATTEMPT_LOCKED`, `DUE_DATE_PASSED`).
- Lists: `?page=0&size=20` → `{ items: [...], page, size, total }`.
- Idempotent writes accept `Idempotency-Key` header (attempt creation, submit).
- Service-to-service (Vix agent → API): `Authorization: Bearer <service JWT>` with scope `vix-agent`, signed with `VIXIR_SERVICE_SECRET`.

## 2. Attempt bootstrap (API → web)
`POST /api/v1/attempts` →
```json
{ "attemptId": "…", "mode": "GRADED", "attemptNo": 1, "seed": "base64-16-bytes",
  "experiment": { "id": "phy.pendulum.g", "version": 3, "config": { /* experiment.schema.json */ } },
  "resume": { "lastEventSeq": 41, "events": [ /* AttemptEvent[] */ ] } }
```

## 3. AttemptEvent (web → API, batched)
`POST /api/v1/attempts/{id}/events` body `{ "events": AttemptEvent[] }`, max 200 per batch.
```json
{ "clientEventId": "uuid", "seq": 42, "type": "READING_RECORDED",
  "simTimeMs": 183400, "clientTs": "2026-11-20T10:21:03Z",
  "payload": { "row": { "L_cm": 60.0, "t_s": 31.27, "n": 20 }, "flags": [] } }
```
Response: `{ "accepted": [seq...], "duplicates": [seq...], "lastEventSeq": 42 }`. Duplicates are not errors.

## 4. ScreenMap (web → Vix agent, LiveKit data topic `vix.screenmap`, JSON, ≤ 16 KB)
Published on change, debounced 300 ms, and on request (`vix.screenmap.request`).
```json
{ "v": 1, "screen": "D1", "route": "/app/x/phy.pendulum.g/lab", "mode": "GRADED",
  "experiment": { "id": "phy.pendulum.g", "title": "Simple pendulum", "step": "READINGS" },
  "viewport": { "w": 1440, "h": 900 },
  "regions": [
    { "id": "bench", "label": "Lab bench", "kind": "panel", "bbox": [272, 64, 760, 620], "visible": true,
      "summary": "Pendulum swinging from retort stand; length set to [redacted] cm" },
    { "id": "dock.stopwatch", "label": "Stopwatch", "kind": "instrument", "bbox": [700, 700, 220, 120], "visible": true,
      "summary": "Running; oscillations passed: [redacted]" }
  ],
  "sim": { "released": true, "warnings": ["ANGLE_OVER_10"], "readingsCount": 3, "readingsTarget": 6 },
  "lastEvents": [ { "type": "WARNING", "code": "PARALLAX" } ] }
```
In GRADED mode the web client replaces every number in `summary` and `sim` (except counts) with `[redacted]`. EXAM mode never connects.

## 5. Vix RPCs (agent → web, LiveKit RPC, payload JSON, response `"ok"` or `{"error": code}`)
| Method | Payload | Effect |
|---|---|---|
| `spotlight` | `{ "regionId": "bench", "durationMs"?: 6000 }` | Dim all but region, ring it |
| `pointAt` | `{ "elementId": "bench.bob", "label": "the bob" }` | Arrow + label on element |
| `startTour` | `{ "tourId": "D1.default", "steps": [{ "regionId": "...", "caption": "..." }] }` | Enter tour mode |
| `tourStep` | `{ "index": 2 }` | Move tour to step |
| `endTour` | `{}` | Remove overlays |
| `openPanel` | `{ "panel": "readings" | "notebook" | "assistant" }` | Switch data-panel tab |
| `showCaption` | `{ "text": "...", "final": true }` | Caption bar text |
The web client rejects any other method and any id not present in the current ScreenMap.

## 6. Vix session bootstrap (web → API)
`POST /api/v1/vix/sessions` body `{ "attemptId"?: "...", "screen": "D1", "consent": { "mic": true, "screen": true, "camera": false }, "voice": "ada", "locale": "en" }` →
`{ "sessionId": "...", "livekitUrl": "wss://...", "token": "<LiveKit JWT>", "room": "vix-<attemptId|sessionId>", "mode": "GRADED", "scriptedTourUrl": "/api/v1/vix/tours/D1" }`
Refused with `VIX_DISABLED_EXAM` (409) for EXAM attempts and `VIX_DISABLED_INSTITUTION` (403) when the school turned Vix off.

## 7. Agent context (agent → API, service auth)
`GET /api/v1/internal/vix/sessions/{id}/context` →
`{ "mode", "locale", "firstName", "experiment": { "id", "title", "procedure": [...steps], "precautions": [...], "glossary": {...} }, "screenTours": {...} }`
`POST /api/v1/internal/vix/sessions/{id}/messages` body `{ "role", "text", "policyBlocked" }` (only stored when retention is on).
`POST /api/v1/internal/vix/sessions/{id}/end` body `{ "turns": 12 }`.

## 8. Experiment config
`packages/experiments/<id>/v<version>.json`, validated by `packages/experiments/experiment.schema.json`. Required keys: `id, version, subject, title, level, curricula, apparatus[], variables{}, instruments{}, model, analysis{plot:[x,y], derive, tolerance}, rubric{criteria[]}, procedure[], precautions[], tours{}`.
