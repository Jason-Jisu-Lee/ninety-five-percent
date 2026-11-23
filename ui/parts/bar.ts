import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'

export const LIFE = 40

export function bar(g: Ctx, x: number, y: number, v: number, w = 16, col = UI.text) {
  g.fillStyle = UI.panel
  g.fillRect(x - w / 2 - 1, y - 1, w + 2, 4)
  g.fillStyle = col
  g.fillRect(x - w / 2, y, Math.ceil(w * v), 2)
}
