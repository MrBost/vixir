# Marking fixtures

Shared test vectors: the Java marker (`apps/api`, `org.vixir.marking`) and the TypeScript practice preview (web) must both produce `expected` for every file in `fixtures/`.

Each fixture: `{ "experiment": "<id>@<version>", "submission": {...}, "expected": { "total": n, "criteria": { "<key>": n } } }`.
Add a fixture for every marking bug you fix.
