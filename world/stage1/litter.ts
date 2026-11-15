import { dither } from '../../core/dither'
import { fbm } from '../../core/noise'
import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'
import { shade } from './shade'

export function pebble(p: Pixels, x: number, y: number, rx: number, ry: number) {
  const inside = (dx: number, dy: number) => (dx / rx) ** 2 + (dy / ry) ** 2 <= 1, lip = Math.min(3, 1 + rx * .08)
  shade(p, x + rx * .4, y + ry * .55, rx, ry * .8)
  p.oval(x, y, rx, ry, (px, py) => !inside(px - x + lip, py - y + lip) ? C.r0
    : (px - x) / rx + (py - y) / ry < -.5 + (rx > 10 ? (fbm(px / 6, py / 6, 4) - .5) * 1.2 : 0) ? C.r2 : C.r1)
}

export function leaf(p: Pixels, x: number, y: number, ang: number, len: number) {
  const c = Math.cos(ang), s = Math.sin(ang), hw = (u: number) => len * .22 * Math.sin(Math.PI * u) ** .7 * (1.15 - .5 * u)
  for (const lift of [1, 0]) p.oval(x + lift * 2, y + lift * 3, len * .7, len * .7, (px, py) => {
    const ox = px - x - lift * 2, oy = py - y - lift * 3, lx = ox * c + oy * s, ly = -ox * s + oy * c, u = lx / len + .5
    if (u < 0 || u > 1) return !lift && u < 0 && u > -.16 && Math.abs(ly) < .8 && C.t1
    if (Math.abs(ly) > hw(u)) return false
    if (lift) return dither(px, py, .5) && C.g0
    return Math.abs(ly) < .7 || (Math.abs(ly) * 1.2 - lx + 200) % 6 < 1 ? C.seed : ly > hw(u) - 1.7 ? C.t0 : C.husk
  })
}

export function ladybug(p: Pixels, x: number, y: number) {
  for (const [dx, dy, col] of [[0, 0, C.red], [1, 0, C.red], [0, 1, C.red], [1, 1, C.r0], [2, 0, C.r0]] as const) p.set(x + dx, y + dy, col)
}
