import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'

export function line(g: Ctx, x: number, ys: number[], col: string) {
  for (const pad of [1, 0]) {
    g.fillStyle = pad ? UI.panel : col
    ys.forEach((y, i) => {
      const was = ys[i ? i - 1 : 0], a = y > was ? Math.min(y, was + 1) : y, b = y < was ? Math.max(y, was - 1) : y
      g.fillRect(x + i - pad, a - pad, 1 + 2 * pad, b - a + 1 + 2 * pad)
    })
  }
}
