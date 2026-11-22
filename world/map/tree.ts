import { dither } from '../../core/draw/dither'
import type { Pixels } from '../../core/draw/pixels'
import { wrap } from '../../core/math/angle'
import { vnoise } from '../../core/math/noise'
import { FOREST as C } from '../../data/look/palette'
import { shade } from '../stage1/scenery/shade'
import { stroke } from '../stage1/scenery/stroke'

const rind = (s: number, u: number) => s > .35 ? C.t2 : s < -.4 ? C.t0 : u % .2 < .03 ? C.t2 : C.t1

export function tree(p: Pixels, x: number, y: number, r: number, roots: number[][], k: number) {
  const seed = x * 7 + y * 13 | 0, flare = Float32Array.from({ length: 256 }, (_, i) => roots.reduce((m, [at, len]) => Math.max(m, Math.exp(-((wrap(i / 256 * 6.283 - at) / .24) ** 2)) * len * k / r), 0))
  shade(p, x + r * .45, y + r * .5, r * 1.45, r * 1.25)
  for (const [a, len, bend] of roots) if (len * k > r * .7) stroke(p, x + Math.cos(a) * r * 1.1, y + Math.sin(a) * r, a, len * k * .5, bend * len * k * .6, u => r * .1 * (1 - u) ** 1.2 + .5, rind)
  p.oval(x, y, r * 1.5, r * 1.36, (px, py) => {
    const dx = (px - x) / r, dy = (py - y) / (r * .9), rr = Math.hypot(dx, dy), a = Math.atan2(dy, dx), lim = .9 + .45 * flare[(a / 6.283 + 1) * 256 & 255], lit = dx + dy
    if (rr > lim) return false
    if (rr > lim - .09) return lit > 0 ? C.t2 : C.t1
    const furrow = vnoise(a * 8, rr * 2.6, seed)
    if (furrow > .68) return C.t2
    if (lit < -.45 && furrow < .45) return C.t0
    return rr < .5 && dither(px, py, (.5 - rr) * 1.4) || lit > .6 && dither(px, py, .5) ? C.t2 : C.t1
  })
}
