/**
 * Seeded, forkable RNG (xoshiro128**). Same seed + same calls => same numbers.
 * Never use Math.random in models; take an Rng instead (see steering simulation-realism.md).
 */
export interface Rng {
  /** Uniform float in [0, 1). */
  next(): number;
  uniform(min: number, max: number): number;
  /** Normally distributed sample (Box–Muller). */
  normal(mean?: number, sd?: number): number;
  /** Independent child stream for a named purpose, e.g. rng.fork('stopwatch'). */
  fork(name: string): Rng;
}

function hash128(text: string): [number, number, number, number] {
  // cyrb128 — small, fast, good avalanche; fine for seeding a PRNG.
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0; i < text.length; i++) {
    const k = text.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

class Xoshiro128 implements Rng {
  private s: [number, number, number, number];
  private spare: number | null = null;
  constructor(private readonly seedText: string) {
    this.s = hash128(seedText);
    if ((this.s[0] | this.s[1] | this.s[2] | this.s[3]) === 0) this.s[0] = 1;
  }
  next(): number {
    const s = this.s;
    const result = Math.imul(rotl(Math.imul(s[1], 5), 7), 9) >>> 0;
    const t = s[1] << 9;
    s[2] ^= s[0]; s[3] ^= s[1]; s[1] ^= s[2]; s[0] ^= s[3];
    s[2] ^= t; s[3] = rotl(s[3], 11);
    return result / 4294967296;
  }
  uniform(min: number, max: number): number {
    return min + (max - min) * this.next();
  }
  normal(mean = 0, sd = 1): number {
    if (this.spare !== null) { const v = this.spare; this.spare = null; return mean + sd * v; }
    let u = 0; while (u === 0) u = this.next();
    const v = this.next();
    const r = Math.sqrt(-2 * Math.log(u));
    this.spare = r * Math.sin(2 * Math.PI * v);
    return mean + sd * r * Math.cos(2 * Math.PI * v);
  }
  fork(name: string): Rng {
    return new Xoshiro128(`${this.seedText}/${name}`);
  }
}

function rotl(x: number, k: number): number {
  return (x << k) | (x >>> (32 - k));
}

/** Create the root RNG for an attempt from the API's base64 seed. */
export function createRng(seed: string): Rng {
  return new Xoshiro128(seed);
}
