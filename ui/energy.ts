import type { Ctx } from '../core/canvas'
import { FOREST as C, UI } from '../data/palette'
import { gem } from './icons'
import { box } from './panel'
import { text } from './text'

export function energy(g: Ctx, n: number) {
  box(g, 8, 8, 54, 15, UI.border, UI.panel)
  gem(g, 16, 15, C.yellow)
  text(g, String(Math.floor(n)), 24, 19, UI.text)
}
