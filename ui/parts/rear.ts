import type { Ctx } from '../../core/screen/canvas'

export function rear(g: Ctx, x: number, y: number, ang: number, col: string) {
  g.fillStyle = col
  for (const d of [7, 11]) for (let j = -2; j < 3; j++) g.fillRect(Math.round(x - Math.cos(ang) * (d + Math.abs(j)) - Math.sin(ang) * j), Math.round(y - Math.sin(ang) * (d + Math.abs(j)) + Math.cos(ang) * j), 1, 1)
}
