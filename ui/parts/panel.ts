import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'

export function panel(g: Ctx, x: number, y: number, w: number, h: number, border: string, fill: string) {
  g.fillStyle = border
  g.fillRect(x + 2, y, w - 4, h)
  g.fillRect(x, y + 2, w, h - 4)
  g.fillRect(x + 1, y + 1, w - 2, h - 2)
  g.fillStyle = fill
  g.fillRect(x + 3, y + 2, w - 6, h - 4)
  g.fillRect(x + 2, y + 3, w - 4, h - 6)
}

export function soft(g: Ctx, x: number, y: number, w: number, h: number, border: string) {
  g.globalAlpha = .84
  panel(g, x, y, w, h, border, UI.panel)
  g.globalAlpha = 1
}

export function box(g: Ctx, x: number, y: number, w: number, h: number, border: string, fill: string) {
  g.fillStyle = border
  g.fillRect(x + 1, y, w - 2, h)
  g.fillRect(x, y + 1, w, h - 2)
  g.fillStyle = fill
  g.fillRect(x + 1, y + 1, w - 2, h - 2)
}
