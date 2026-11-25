import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'

export const LIFE = 18

export function gauge(g: Ctx, x: number, y: number, w: number, v: number, col: string) {
  g.fillStyle = UI.panel
  g.fillRect(x - 1, y - 1, w + 2, 6)
  g.fillStyle = UI.line
  g.fillRect(x, y, w, 4)
  g.fillStyle = col
  g.fillRect(x, y, Math.round(w * Math.min(1, v)), 4)
}

export function bar(g: Ctx, x: number, y: number, v: number, w = 16, col = UI.text) {
  g.fillStyle = UI.panel
  g.fillRect(x - w / 2 - 1, y - 1, w + 2, 4)
  g.fillStyle = col
  g.fillRect(x - w / 2, y, Math.ceil(w * v), 2)
}
