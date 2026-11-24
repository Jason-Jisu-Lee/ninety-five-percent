import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'

export function brackets(g: Ctx, [x, y, w, h]: number[], e: number, dx = 0) {
  for (const [col, o] of [[UI.panel, 1], [UI.accent, 0]] as const) {
    g.fillStyle = col
    for (const a of [0, 1]) for (const b of [0, 1]) {
      const cx = x - e + dx + o + a * (w + 2 * e - 1), cy = y - e + o + b * (h + 2 * e - 1)
      g.fillRect(a ? cx - 4 : cx, cy, 5, 1)
      g.fillRect(cx, b ? cy - 4 : cy, 1, 5)
    }
  }
}
