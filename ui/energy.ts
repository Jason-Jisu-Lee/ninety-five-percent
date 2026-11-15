import type { Ctx } from '../core/canvas'
import { FOREST as C, UI } from '../data/palette'
import { box } from './panel'
import { text } from './text'

export function energy(g: Ctx, n: number) {
  const s = String(Math.floor(n))
  box(g, 8, 8, 24 + s.length * 6, 15, UI.border, UI.panel)
  g.fillStyle = C.yellow
  for (let i = -2; i <= 2; i++) g.fillRect(14 + Math.abs(i), 15 + i, 5 - 2 * Math.abs(i), 1)
  text(g, s, 24, 19, 10, UI.text)
}
