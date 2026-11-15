import { dither } from '../../core/dither'
import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'
import { shade } from './shade'

export function pebble(p: Pixels, x: number, y: number, rx: number, ry: number) {
  const inside = (dx: number, dy: number) => (dx / rx) ** 2 + (dy / ry) ** 2 <= 1
  shade(p, x + rx * .4, y + ry * .55, rx, ry * .8)
  p.oval(x, y, rx, ry, (px, py) => !inside(px - x + 1.5, py - y + 1.5) ? C.r0 : (px - x) / rx + (py - y) / ry < -.5 ? C.r2 : C.r1)
}

export function leaf(p: Pixels, x: number, y: number, ang: number, len: number) {
  const c = Math.cos(ang), s = Math.sin(ang), hw = (u: number) => 11 * Math.sin(Math.PI * u) ** .7 * (1.15 - .5 * u)
  for (const lift of [1, 0]) p.oval(x + lift * 3, y + lift * 4, len * .7, len * .7, (px, py) => {
    const ox = px - x - lift * 3, oy = py - y - lift * 4, lx = ox * c + oy * s, ly = -ox * s + oy * c, u = lx / len + .5
    if (u < 0 || u > 1) return !lift && u < 0 && u > -.16 && Math.abs(ly) < .8 && C.t1
    if (Math.abs(ly) > hw(u)) return false
    if (lift) return dither(px, py, .5) && C.g0
    return Math.abs(ly) < .7 || (Math.abs(ly) * 1.2 - lx + 200) % 8 < 1 ? C.seed : ly > hw(u) - 2.2 ? C.t0 : C.husk
  })
}
