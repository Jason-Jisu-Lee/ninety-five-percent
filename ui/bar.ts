import type { Ctx } from '../core/canvas'
import { UI } from '../data/palette'

export function bar(g: Ctx, x: number, y: number, v: number, w = 16, col = UI.text, mark = 0) {
  g.fillStyle = UI.panel
  g.fillRect(x - w / 2 - 1, y - 1, w + 2, 4)
  g.fillStyle = col
  g.fillRect(x - w / 2, y, Math.ceil(w * v), 2)
  g.fillStyle = UI.text
  if (mark) g.fillRect(x - w / 2 + Math.round(w * mark), y - 1, 1, 4)
}
