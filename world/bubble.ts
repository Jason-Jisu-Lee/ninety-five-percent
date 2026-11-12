import type { Ctx } from '../core/canvas'
import { UI } from '../data/palette'

export function bubble(g: Ctx, x: number, y: number) {
  g.fillStyle = UI.glint
  g.fillRect(x, y - 1, 1, 1)
  g.fillRect(x - 1, y, 1, 1)
  g.fillRect(x + 1, y, 1, 1)
  g.fillRect(x, y + 1, 1, 1)
  g.fillStyle = UI.text
  g.fillRect(x - 1, y - 1, 1, 1)
}
