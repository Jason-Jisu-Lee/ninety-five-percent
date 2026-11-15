import type { Ctx } from '../core/canvas'

export function ring(g: Ctx, x: number, y: number, r: number, col: string) {
  g.fillStyle = col
  for (let i = 0, n = Math.round(r * .8); i < n; i++) g.fillRect(Math.round(x + Math.cos(i / n * 6.283) * r), Math.round(y + Math.sin(i / n * 6.283) * r * .9), 2, 1)
}
