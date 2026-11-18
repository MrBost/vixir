import type { Rng } from './rng';

/** Round to an instrument's resolution (always the LAST step). */
export function roundTo(value: number, resolution: number): number {
  const r = Math.round(value / resolution) * resolution;
  const decimals = Math.max(0, -Math.floor(Math.log10(resolution)) + 1);
  return Number(r.toFixed(decimals));
}

export interface ScaleInstrument {
  resolution: number;
  zeroError?: number;
  /** Max parallax offset when the eye is not level with the scale. */
  parallaxBound?: number;
}

/** Read a scale (metre rule, burette, dial). */
export function readScale(trueValue: number, inst: ScaleInstrument, rng: Rng, opts: { eyeLevel: boolean; zeroed?: boolean }): number {
  let v = trueValue;
  if (!opts.zeroed && inst.zeroError) v += inst.zeroError;
  if (!opts.eyeLevel && inst.parallaxBound) v += rng.uniform(0.3, 1) * inst.parallaxBound;
  return roundTo(v, inst.resolution);
}

export interface TimingInstrument {
  resolution: number;
  /** Std dev of human reaction error per start/stop press, seconds. */
  reactionSigma: number;
}

/** Elapsed time as a human with a stopwatch would measure it. */
export function readStopwatch(trueElapsed: number, inst: TimingInstrument, rng: Rng): number {
  const startErr = rng.normal(0, inst.reactionSigma);
  const stopErr = rng.normal(0, inst.reactionSigma);
  return roundTo(Math.max(0, trueElapsed + stopErr - startErr), inst.resolution);
}
