import { dither } from '../../core/dither'
import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'
import { depth } from './pond'
import { stroke } from './stroke'

export function reed(p: Pixels, x: number, y: number, len: number, lean: number) {
  const head = (u: number) => u > .66 && u < .9
  stroke(p, x, y, .12, len * .64, 2, () => 1, (_s, _u, px, py) => dither(px, py, .5) && (depth(px, py) > 2 ? C.w3 : C.g0))
  stroke(p, x, y, Math.atan2(-len, lean), Math.hypot(len, lean), lean * .25, u => head(u) ? 2 : u < .9 ? 1 : .55,
    (s, u) => head(u) ? (s > .3 ? C.t2 : s < -.3 ? C.t0 : C.t1) : s > .2 ? C.g0 : C.g3)
}
