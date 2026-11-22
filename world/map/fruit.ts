import { dither } from '../../core/draw/dither'
import type { Pixels } from '../../core/draw/pixels'
import { FOREST as C } from '../../data/look/palette'
import { shade } from '../stage1/scenery/shade'

export function fruit(p: Pixels, x: number, y: number, r: number) {
  shade(p, x + r * .5, y + r * .65, r * 1.1, r * .7)
  p.oval(x, y, r, r * .92, (px, py, d) => {
    const dx = (px - x) / r, dy = (py - y) / r, lit = dx + dy
    if (d > .78 && lit > .25) return C.t0
    if (Math.hypot(dx + .38, dy + .42) < .2) return C.pink
    if (Math.hypot(dx - .3, dy - .2) < .3) return C.seed
    return dx - dy > .5 && dither(px, py, .5) ? C.yellow : C.red
  })
  if (r < 4) return
  p.oval(x - r * .1, y - r * .95, 1, r * .22, () => C.t2)
}
