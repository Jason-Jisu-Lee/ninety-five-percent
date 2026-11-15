import { dither } from '../../../core/draw/dither'
import { fbm, vnoise } from '../../../core/math/noise'
import type { Pixels } from '../../../core/draw/pixels'
import { FOREST as C } from '../../../data/look/palette'
import { STUMP } from '../../../data/stage2/map'
import { shade } from '../../stage1/scenery/shade'
import { stroke } from '../../stage1/scenery/stroke'

const rind = (s: number, u: number) => s > .35 ? C.t2 : s < -.4 ? C.t0 : u % .2 < .03 ? C.t2 : C.t1

export function stump(p: Pixels) {
  const { x, y, r, wall, roots } = STUMP, ry = r * .86
  shade(p, x + 12, y + wall + 10, r * 1.15, ry)
  roots.forEach(([a, len], i) => stroke(p, x + Math.cos(a) * r * .8, y + wall + Math.sin(a) * ry * .8, a, len, (i & 1 ? -.4 : .4) * len, u => 5.2 * (1 - u) ** 1.4 + .7, rind))
  p.oval(x, y + wall, r, ry, (px, _py, d) => d > .9 ? C.t2 : vnoise(px / 2.6, 0, 61) > .6 ? C.t2 : px - x < -r * .35 ? C.t0 : C.t1)
  p.oval(x, y, r, ry, (px, py, d) => {
    const rr = Math.sqrt(d) + (fbm(px / 9, py / 9, 67) - .5) * .12, a = Math.atan2(py - y, px - x), moss = fbm(px / 15, py / 15, 73)
    if (d > .86) return moss > .56 ? dither(px, py, .5) ? C.g3 : C.g2 : d > .95 ? C.t2 : C.t1
    if (Math.abs(vnoise(a * 2.2, 0, 79) - .5) < .02 && rr > .2) return C.seed
    return rr < .1 ? C.seed : (rr * 13 | 0) & 1 ? C.husk : (rr * 13 | 0) % 6 < 1 ? C.seed : C.white
  })
}
