# How we used Kiro 

Add an entry every time a Kiro feature saves real time or changes the outcome. Keep it honest and specific.

| Date | Who | Feature (spec / steering / hook / MCP / property test / vibe) | What we did | What it saved or caught |
|---|---|---|---|---|
| 2026-11-18 | | Steering | Committed product, tech, structure + 3 scoped steering files | |

## Specs
- List each spec, how many requirements, what changed after review of design.md / tasks.md.

## Property-based tests
- List the properties Kiro turned into fast-check tests and any bug they found.

## Hooks
- Name each hook, its trigger, and one time it fired usefully.

## MCP
- Which servers, what each was used for.
| 2026-11-18 | Kiro | Steering alignment | Fixed YAML front-matter headers for `product.md`, `structure.md`, `tech.md` (removed duplicate `---` blocks) | Clean steering files with consistent `inclusion: always` declarations |
| 2026-11-18 | Kiro | Hooks setup | Created `.kiro/hooks/lint-on-save.json` with `PostFileSave` trigger to run `pnpm lint` | Auto-linting on file save, catching style issues early |
| 2026-11-18 | Kiro | CI workflow | Added `test -f turbo.json` check to CI `web` job before running `pnpm turbo run` | CI fails fast if turbo.json is missing |
| 2026-11-18 | Folajimi | Hooks setup | Created `.kiro/hooks/lint-on-save.json` with `PostFileSave` trigger to run `pnpm lint` | Auto-linting on file save, catching style issues early |
| 2026-11-18 | Folajimi | CI workflow | Added `test -f turbo.json` check to CI `web` job before running `pnpm turbo run` | CI fails fast if turbo.json is missing |
| 2026-11-18 | Folajimi | Asset cleanup | Removed placeholder SVG files: A_logo_vixir.svg, D*.svg lab benches, apparatus SVGs (rule, dial, flask, pipette, retort, vernier) | Preparing for building screens from design images using Haiku 4.5 for vision |
| 2026-11-18 | Folajimi | Screens (A1, A2) | Built A1 Landing and A2 Auth screens from design images using Haiku 4.5 vision | 2 P0 screens complete: responsive hero, value props, 4-step process, institution benefits, OAuth; auth form with role selection and class code |
