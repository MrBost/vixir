/** Simple pendulum period with the first large-angle correction. SI units. */
export function pendulumPeriod(lengthM: number, g: number, theta0Deg: number): number {
  if (lengthM <= 0 || g <= 0) throw new RangeError('length and g must be positive');
  const a = (theta0Deg * Math.PI) / 180;
  return 2 * Math.PI * Math.sqrt(lengthM / g) * (1 + (a * a) / 16);
}

/** Angle (degrees) at simulated time t, with slow exponential decay. */
export function pendulumAngle(theta0Deg: number, periodS: number, tS: number, decayTauS = 400): number {
  return theta0Deg * Math.cos((2 * Math.PI * tS) / periodS) * Math.exp(-tS / decayTauS);
}
