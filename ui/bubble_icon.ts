import type { Ctx } from '../core/canvas'
import { UI } from '../data/palette'

export function bubbleIcon(g: Ctx, x: number, y: number) {
  g.fillStyle = UI.glint
  g.fillRect(x + 2, y, 3, 1)
  g.fillRect(x + 2, y + 6, 3, 1)
  g.fillRect(x, y + 2, 1, 3)
  g.fillRect(x + 6, y + 2, 1, 3)
  for (const [i, j] of [[1, 1], [5, 1], [1, 5], [5, 5]]) g.fillRect(x + i, y + j, 1, 1)
  g.fillStyle = UI.text
  g.fillRect(x + 2, y + 2, 1, 1)
}
