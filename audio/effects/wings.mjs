import { SR, TAU } from '../chip/tables.mjs'

const LEN = .8, RISE = .05, HOLD = .15, Q = 3.5

export function wings() {
  let seed = 7, lo = 0, bp = 0, lo2 = 0, bp2 = 0
  return Float32Array.from({ length: LEN * SR }, (_, i) => {
    const t = i / SR, u = t / LEN, f = 2 * Math.sin(Math.PI * (900 + 600 * u) / SR), hp = (seed = seed * 1664525 + 1013904223 >>> 0) / 2 ** 31 - 1 - lo - bp / Q
    bp += f * hp
    lo += f * bp
    const hp2 = bp / Q - lo2 - bp2 / Q
    bp2 += f * hp2
    lo2 += f * bp2
    const loud = Math.min(1, t / RISE) * (t < HOLD ? 1 : Math.exp(-(t - HOLD) / ((LEN - HOLD) / 4.6))) * Math.min(1, (LEN - t) / .01)
    return bp2 * loud * (.25 + .75 * (.5 + .5 * Math.sin(TAU * (30 + 12 * u) * t)) ** 2)
  })
}
