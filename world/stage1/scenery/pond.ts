import { wrap } from '../../../core/math/angle'
import { dither } from '../../../core/draw/dither'
import { vnoise } from '../../../core/math/noise'
import type { Pixels } from '../../../core/draw/pixels'
import { FOREST as C } from '../../../data/look/palette'
import { PADS, POND } from '../../../data/stage1/map'

export const depth = (x: number, y: number, P = POND) =>
  P.r - Math.hypot(x - P.x, y - P.y) + (vnoise(Math.atan2(y - P.y, x - P.x) * 14, 0, 3) - .5) * P.wave

const inside = ([cx, cy, r]: number[], x: number, y: number) => ((x - cx) / r) ** 2 + ((y - cy) / (r * .88)) ** 2 <= 1

export const onPad = (x: number, y: number) => PADS.some(q => inside(q, x, y))

export function water(p: Pixels, deep: (x: number, y: number) => number, k: number, x0: number, y0: number, x1: number, y1: number) {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const e = deep(x, y) / k
    if (e < -10 || e < -4 && !dither(x, y, .5)) continue
    p.set(x, y, e < 0 ? C.t1 : e < 2.5 ? C.t2 : deep(x - 1, y - 4 * k) / k < 2.5 ? C.w3 : e < 9 ? C.wSh
      : e > 34 && dither(x, y, Math.min(1, (e - 34) / 50)) ? C.w2 : C.w1)
  }
}

export function pads(p: Pixels, list: number[][], k = 1) {
  for (const [cx, cy, r] of list) p.oval(cx + 4 * k, cy + 5 * k, r, r * .88, () => C.w3)
  for (const q of list) {
    const [cx, cy, r, notch] = q
    p.oval(cx, cy, r, r * .88, (x, y, d) => {
      const a = wrap(Math.atan2((y - cy) / .88, x - cx) - notch), rr = Math.sqrt(d)
      return Math.abs(a) < .2 && rr > .1 ? false : rr > .95 || Math.abs(a) < .25 && rr > .1 ? C.cDark
        : Math.abs(Math.sin(a * 5.5)) < .04 / rr ? C.cMid : !inside(q, x + 3 * k, y + 3 * k) ? C.cLight
        : x - cx + y - cy < -r * .55 && dither(x, y, .5) ? C.g3 : C.g2
    })
  }
}
