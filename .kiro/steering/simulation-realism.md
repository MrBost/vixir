---
inclusion: fileMatch
fileMatchPattern: "packages/sim-core/**,packages/experiments/**,apps/web/src/labs/**"
---
# Simulation realism rules

- One seed per attempt (`attemptSeed`), derived streams per purpose: `rng.fork('stopwatch')`, `rng.fork('specimen')`. Same seed + same actions ⇒ identical readings.
- Hidden per-student values (bob mass, acid concentration, wire resistance, beam stiffness) are drawn from the experiment config's ranges using the seed.
- Instruments own error: `resolution`, `zeroError`, `parallax` (only when the eye-level flag is off), `reactionSigma` for human timing. Round to resolution LAST.
- Physics must be right first, then add noise. Use the large-angle correction for the pendulum; Henderson-style strong acid/strong base pH for titration.
- Every model needs property-based tests (fast-check) for: monotonicity, determinism by seed, noise bounded by the instrument's tolerance, unit sanity.
- Animation time is separate from simulated time; a speed multiplier (×1, ×2, ×5) is allowed in practice mode only.
- Never show the true value in graded mode. Practice mode may show a "practice readout".
