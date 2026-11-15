import type { Ctx } from '../core/canvas'
import { UI } from '../data/palette'

export function healthBar(g: Ctx, x: number, y: number, v: number, w = 16) {
  g.fillStyle = UI.panel
  g.fillRect(x - w / 2 - 1, y - 1, w + 2, 4)
  g.fillStyle = UI.text
  g.fillRect(x - w / 2, y, Math.ceil(w * v), 2)
}
