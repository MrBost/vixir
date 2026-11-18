import { expect, it } from 'vitest';
import { linearFit } from '../src';

it('recovers an exact line', () => {
  const fit = linearFit([{ x: 0.4, y: 1.61 }, { x: 0.6, y: 2.415 }, { x: 0.8, y: 3.22 }]);
  expect(fit.slope).toBeCloseTo(4.025, 3);
  expect(fit.r2).toBeCloseTo(1, 6);
});
