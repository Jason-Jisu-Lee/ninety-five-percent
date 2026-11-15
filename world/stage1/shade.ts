import { dither } from '../../core/dither'
import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'

export const shade = (p: Pixels, cx: number, cy: number, rx: number, ry: number) =>
  p.oval(cx, cy, rx, ry, (x, y, d) => dither(x, y, d > .6 ? .25 : .5) && C.g0)
