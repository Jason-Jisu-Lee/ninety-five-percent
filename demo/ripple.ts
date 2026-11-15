import { dither } from '../core/draw/dither'
import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { hits } from './hits'

const LIFE = 1.1, REACH = 13, rings: number[] = [], hit = hits(.45)

export function ripple(g: Ctx, right: number, cy: number, level: number[], dt: number) {
  const cx = right - REACH - 2
  if (hit(level, dt)) rings.push(0)
  for (let i = rings.length; i--;) if ((rings[i] += dt / LIFE) >= 1) rings.splice(i, 1)
  g.fillStyle = UI.text
  g.fillRect(cx, cy, 1, 1)
  for (const age of rings) {
    const rx = 2 + age * REACH, n = Math.ceil(rx * 5)
    for (let i = 0; i < n; i++) {
      const x = Math.round(cx + Math.cos(i / n * 6.283) * rx), y = Math.round(cy + Math.sin(i / n * 6.283) * rx * .5)
      if (dither(x, y, 1.1 - age * age)) g.fillRect(x, y, 1, 1)
    }
  }
}
