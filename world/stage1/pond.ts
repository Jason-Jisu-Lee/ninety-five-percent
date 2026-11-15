import { wrap } from '../../core/angle'
import { dither } from '../../core/dither'
import { vnoise } from '../../core/noise'
import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'
import { H } from '../../data/screen'
import { PAD, POND } from '../../data/stage1'

export const depth = (x: number, y: number) =>
  POND.r - Math.hypot(x - POND.x, y - POND.y) + (vnoise(Math.atan2(y - POND.y, x - POND.x) * 14, 0, 3) - .5) * 16

export const onPad = (x: number, y: number) => ((x - PAD.x) / PAD.r) ** 2 + ((y - PAD.y) / (PAD.r * .88)) ** 2 <= 1

export function pond(p: Pixels) {
  const { x: cx, y: cy, r } = PAD
  for (let y = 170; y < H; y++) for (let x = 0; x < 240; x++) {
    const e = depth(x, y)
    if (e < -10 || e < -4 && !dither(x, y, .5)) continue
    p.set(x, y, e < 0 ? C.t1 : e < 2.5 ? C.t2 : depth(x - 1, y - 4) < 2.5 ? C.w3 : e < 9 ? C.wSh
      : e > 34 && dither(x, y, Math.min(1, (e - 34) / 50)) ? C.w2 : C.w1)
  }
  p.oval(cx + 5, cy + 6, r, r * .88, () => C.w3)
  p.oval(cx, cy, r, r * .88, (x, y, d) => {
    const a = wrap(Math.atan2((y - cy) / .88, x - cx) - PAD.notch), rr = Math.sqrt(d)
    return Math.abs(a) < .2 && rr > .1 ? false : rr > .95 || Math.abs(a) < .25 && rr > .1 ? C.cDark
      : Math.abs(Math.sin(a * 5.5)) < .04 / rr ? C.cMid : !onPad(x + 4, y + 4) ? C.cLight
      : x - cx + y - cy < -r * .55 && dither(x, y, .5) ? C.g3 : C.g2
  })
}
