import type { Ctx } from '../../core/screen/canvas'

export function marks(g: Ctx, x: number, y: number, r: number, col: string, arm = 3) {
  g.fillStyle = col
  for (const a of [-1, 1]) for (const b of [-1, 1]) {
    g.fillRect(a < 0 ? x - r : x + r - arm + 1, y + b * r, arm, 1)
    g.fillRect(x + a * r, b < 0 ? y - r : y + r - arm + 1, 1, arm)
  }
}
