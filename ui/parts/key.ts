import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { text } from '../text/text'
import { box } from './panel'

export function key(g: Ctx, x: number, y: number, ch = 'A', down = false) {
  const face = down ? '#fff' : UI.border, d = down ? 2 : 0
  box(g, x, y, 11, 13, UI.dim, UI.dim)
  box(g, x, y + d, 11, 11, face, face)
  text(g, ch, x + 3, y + 9 + d, UI.panel)
}
