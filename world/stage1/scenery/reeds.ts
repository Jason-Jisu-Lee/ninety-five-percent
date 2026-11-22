import { dither } from '../../../core/draw/dither'
import type { Pixels } from '../../../core/draw/pixels'
import { FOREST as C } from '../../../data/look/palette'
import { Z } from '../../../data/stage1/map'
import { depth } from './pond'
import { stroke } from './stroke'

export function reed(p: Pixels, x: number, y: number, len: number, lean: number, dry = false) {
  const head = (u: number) => u > (dry ? .74 : .66) && (dry || u < .9)
  stroke(p, x, y, .12, len * .64, 2, () => 1, (_s, _u, px, py) => dither(px, py, .5) && (depth(px, py) > 2 ? C.w3 : C.g0))
  stroke(p, x, y, Math.atan2(-len, lean), Math.hypot(len, lean), lean * .25, u => (head(u) ? dry ? 1.6 : 2 : u < .9 ? dry ? .7 : 1 : .55) * Z,
    (s, u) => head(u) ? (s > .3 ? C.t2 : s < -.3 ? dry ? C.husk : C.t0 : dry ? C.seed : C.t1) : dry ? s > .2 ? C.t1 : C.husk : s > .2 ? C.g0 : C.g3)
}
