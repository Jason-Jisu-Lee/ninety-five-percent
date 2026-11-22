import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { text } from '../text/text'
import { box } from './panel'

export function key(g: Ctx, x: number, y: number) {
  box(g, x, y, 11, 13, UI.dim, UI.dim)
  box(g, x, y, 11, 11, UI.border, UI.border)
  text(g, 'A', x + 3, y + 9, UI.panel)
}
