import type { Ctx } from '../core/canvas'

export function reticle(g: Ctx, x: number, y: number, r: number, col: string) {
  g.fillStyle = col
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    g.fillRect(x + sx * r - (sx > 0 ? 2 : 0), y + sy * r, 3, 1)
    g.fillRect(x + sx * r, y + sy * r - (sy > 0 ? 2 : 0), 1, 3)
  }
}
