import type { Ctx } from '../../core/screen/canvas'

export function ring(g: Ctx, x: number, y: number, r: number, col: string) {
  g.fillStyle = col
  for (let i = 0, n = Math.max(8, Math.ceil(r * 6.3)); i < n; i++) g.fillRect(Math.round(x + Math.cos(i / n * 6.283) * r), Math.round(y + Math.sin(i / n * 6.283) * r), 1, 1)
}
