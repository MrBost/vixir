export interface Point { x: number; y: number }
export interface LinearFit { slope: number; intercept: number; r2: number }

/** Ordinary least squares y = slope * x + intercept. Needs at least 2 distinct x. */
export function linearFit(points: readonly Point[]): LinearFit {
  const n = points.length;
  if (n < 2) throw new RangeError('need at least 2 points');
  const mx = points.reduce((s, p) => s + p.x, 0) / n;
  const my = points.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (const p of points) { sxx += (p.x - mx) ** 2; sxy += (p.x - mx) * (p.y - my); syy += (p.y - my) ** 2; }
  if (sxx === 0) throw new RangeError('x values must not all be equal');
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  return { slope, intercept, r2 };
}
