import type { Ctx } from '../core/canvas'

export function bar(g: Ctx, x: number, y: number, w: number, h: number, v: number, track: string, fill: string, head: string) {
  const n = Math.round(w * v)
  g.fillStyle = track
  g.fillRect(x, y, w, h)
  g.fillStyle = fill
  g.fillRect(x, y, n, h)
  g.fillStyle = head
  g.fillRect(x + n - 1, y - 1, 2, h + 2)
}
