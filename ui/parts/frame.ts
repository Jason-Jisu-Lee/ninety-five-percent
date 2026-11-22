import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'

export function frame(g: Ctx, x: number, y: number, w: number, h: number, lit: boolean) {
  g.fillStyle = lit ? UI.gold : UI.line
  g.fillRect(x, y, w, h)
  g.fillStyle = UI.night
  g.fillRect(x + 1, y + 1, w - 2, h - 2)
}
