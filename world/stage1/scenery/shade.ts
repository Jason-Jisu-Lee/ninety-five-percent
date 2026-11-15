import { dither } from '../../../core/draw/dither'
import type { Pixels } from '../../../core/draw/pixels'
import { FOREST as C } from '../../../data/look/palette'

export const shade = (p: Pixels, cx: number, cy: number, rx: number, ry: number) =>
  p.oval(cx, cy, rx, ry, (x, y, d) => dither(x, y, d > .6 ? .25 : .5) && C.g0)
