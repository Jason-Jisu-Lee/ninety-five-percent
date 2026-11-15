import type { Ctx } from '../../core/screen/canvas'

export function spot(g: Ctx, x: number, y: number, col: string) {
  g.fillStyle = col
  for (const d of [-2, 2]) {
    g.fillRect(x - 1, y + d, 3, 1)
    g.fillRect(x + d, y - 1, 1, 3)
  }
}

export function marks(g: Ctx, x: number, y: number, r: number, col: string, arm = 3) {
  g.fillStyle = col
  for (const a of [-1, 1]) for (const b of [-1, 1]) {
    g.fillRect(a < 0 ? x - r : x + r - arm + 1, y + b * r, arm, 1)
    g.fillRect(x + a * r, b < 0 ? y - r : y + r - arm + 1, 1, arm)
  }
}
