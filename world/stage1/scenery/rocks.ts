import { dither } from '../../../core/draw/dither'
import { fbm, vnoise } from '../../../core/math/noise'
import type { Pixels } from '../../../core/draw/pixels'
import { FOREST as C } from '../../../data/look/palette'
import { shade } from './shade'

export function scree(p: Pixels, { x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) {
  p.oval(x, y, rx * 1.25, ry * 1.25, (px, py) => {
    const d = Math.hypot((px - x) / rx, (py - y) / ry) + (fbm(px / 18, py / 18, 23) - .5) * .7, grit = vnoise(px / 1.7, py / 1.7, 41)
    if (d > 1 || d > .72 && !dither(px, py, (1 - d) * 3.2)) return false
    return grit > .86 ? C.r1 : grit < .1 ? C.t2 : grit > .68 && d < .8 ? C.t0 : C.t1
  })
}

export function slab(p: Pixels, x: number, y: number, rx: number, ry: number) {
  const inside = (dx: number, dy: number) => (dx / rx) ** 2 + (dy / ry) ** 2 <= 1
  shade(p, x + rx * .3, y + ry * .6, rx, ry * .8)
  p.oval(x, y, rx, ry, (px, py) => {
    const dx = px - x, dy = py - y, crack = Math.abs(vnoise(px / 9, py / 5, 57) - .5) < .025
    return !inside(dx + 2, dy + 3) ? C.r0 : !inside(dx + 1, dy + 1.5) ? C.r1 : crack ? C.r1 : dx / rx + dy / ry < -.25 + (fbm(px / 7, py / 7, 9) - .5) ? C.white : C.r2
  })
}
