import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { createRng, pendulumPeriod, readStopwatch, roundTo } from '../src';

const length = fc.double({ min: 0.2, max: 1.5, noNaN: true });
const angle = fc.double({ min: 1, max: 15, noNaN: true });

describe('pendulum properties', () => {
  it('period increases strictly with length', () => {
    fc.assert(fc.property(length, length, angle, (l1, l2, a) => {
      fc.pre(Math.abs(l1 - l2) > 1e-6);
      const [s, l] = l1 < l2 ? [l1, l2] : [l2, l1];
      expect(pendulumPeriod(s, 9.81, a)).toBeLessThan(pendulumPeriod(l, 9.81, a));
    }));
  });
  it('T^2/L is within 1% of 4π²/g for small angles', () => {
    fc.assert(fc.property(length, fc.double({ min: 1, max: 5, noNaN: true }), (l, a) => {
      const t = pendulumPeriod(l, 9.81, a);
      expect(Math.abs((t * t) / l / ((4 * Math.PI ** 2) / 9.81) - 1)).toBeLessThan(0.01);
    }));
  });
  it('stopwatch readings are multiples of the resolution and bounded by reaction error', () => {
    fc.assert(fc.property(fc.string({ minLength: 1 }), fc.double({ min: 5, max: 60, noNaN: true }), (seed, elapsed) => {
      const r = readStopwatch(elapsed, { resolution: 0.01, reactionSigma: 0.09 }, createRng(seed));
      expect(roundTo(r, 0.01)).toBeCloseTo(r, 10);
      expect(Math.abs(r - elapsed)).toBeLessThan(8 * 0.09 + 0.01);
    }));
  });
});
