import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { createRng } from '../src';

describe('rng properties', () => {
  it('is deterministic for the same seed', () => {
    fc.assert(fc.property(fc.string({ minLength: 1 }), (seed) => {
      const a = createRng(seed), b = createRng(seed);
      for (let i = 0; i < 20; i++) expect(a.next()).toBe(b.next());
    }));
  });
  it('stays in [0, 1)', () => {
    fc.assert(fc.property(fc.string({ minLength: 1 }), (seed) => {
      const r = createRng(seed);
      for (let i = 0; i < 50; i++) { const v = r.next(); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); }
    }));
  });
  it('forked streams are independent of extra draws on the parent', () => {
    fc.assert(fc.property(fc.string({ minLength: 1 }), fc.nat({ max: 50 }), (seed, extra) => {
      const a = createRng(seed); const b = createRng(seed);
      for (let i = 0; i < extra; i++) b.next();
      expect(a.fork('stopwatch').next()).toBe(b.fork('stopwatch').next());
    }));
  });
});
