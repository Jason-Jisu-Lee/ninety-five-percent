import { wrap } from '../../core/angle'
import { dither } from '../../core/dither'
import { vnoise } from '../../core/noise'
import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'
import { H } from '../../data/screen'
import { PADS, POND } from '../../data/stage1/scene'

export const depth = (x: number, y: number) =>
  POND.r - Math.hypot(x - POND.x, y - POND.y) + (vnoise(Math.atan2(y - POND.y, x - POND.x) * 14, 0, 3) - .5) * 14

const inside = ([cx, cy, r]: number[], x: number, y: number) => ((x - cx) / r) ** 2 + ((y - cy) / (r * .88)) ** 2 <= 1

export const onPad = (x: number, y: number) => PADS.some(q => inside(q, x, y))

export function pond(p: Pixels) {
  for (let y = 200; y < H; y++) for (let x = 0; x < POND.x + POND.r; x++) {
    const e = depth(x, y)
    if (e < -10 || e < -4 && !dither(x, y, .5)) continue
    p.set(x, y, e < 0 ? C.t1 : e < 2.5 ? C.t2 : depth(x - 1, y - 4) < 2.5 ? C.w3 : e < 9 ? C.wSh
      : e > 34 && dither(x, y, Math.min(1, (e - 34) / 50)) ? C.w2 : C.w1)
  }
  for (const [cx, cy, r] of PADS) p.oval(cx + 4, cy + 5, r, r * .88, () => C.w3)
  for (const q of PADS) {
    const [cx, cy, r, notch] = q
    p.oval(cx, cy, r, r * .88, (x, y, d) => {
      const a = wrap(Math.atan2((y - cy) / .88, x - cx) - notch), rr = Math.sqrt(d)
      return Math.abs(a) < .2 && rr > .1 ? false : rr > .95 || Math.abs(a) < .25 && rr > .1 ? C.cDark
        : Math.abs(Math.sin(a * 5.5)) < .04 / rr ? C.cMid : !inside(q, x + 3, y + 3) ? C.cLight
        : x - cx + y - cy < -r * .55 && dither(x, y, .5) ? C.g3 : C.g2
    })
  }
}
