import { SR, TAU } from '../chip/tables.mjs'

const hit = (t, rise, fall) => Math.min(1, t / rise) * Math.exp(-t / fall)
const make = (len, f) => Float32Array.from({ length: len * SR }, (_, i) => f(i / SR) * Math.min(1, (len - i / SR) / .004))

export const blip = () => make(.07, t => Math.sin(TAU * 660 * t) * hit(t, .003, .012))

export function knock() {
  let seed = 3370493291, lo = 0, bp = 0, lo2 = 0, bp2 = 0, ph = 0
  const f = 2 * Math.sin(Math.PI * 1800 / SR)
  return make(.07, t => {
    const hp = (seed = seed * 1664525 + 1013904223 >>> 0) / 2 ** 31 - 1 - lo - bp / 2
    bp += f * hp
    lo += f * bp
    const hp2 = bp / 2 - lo2 - bp2 / 2
    bp2 += f * hp2
    lo2 += f * bp2
    ph += (230 - 60 * Math.min(1, t / .05)) / SR
    return Math.sin(TAU * ph) * hit(t, .002, .013) + bp2 * .25 * hit(t, .001, .003)
  })
}

export function cork() {
  let seed = 3370493291, lo = 0, bp = 0, ph = 0
  const f = 2 * Math.sin(Math.PI * 2600 / SR)
  return make(.1, t => {
    const hp = (seed = seed * 1664525 + 1013904223 >>> 0) / 2 ** 31 - 1 - lo - bp / 1.2
    bp += f * hp
    lo += f * bp
    ph += (950 - 690 * Math.min(1, t / .04) ** .7) / SR
    return Math.sin(TAU * ph) * hit(t, .002, .024) + bp * .5 * hit(t, .0005, .002) * Math.max(0, Math.min(1, (.02 - t) / .004))
  })
}
