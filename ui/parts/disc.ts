import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'

const half = (r: number, j: number) => Math.abs(j) > r ? -1 : Math.floor(Math.sqrt(r * r + r - j * j))

export function disc(g: Ctx, cx: number, cy: number, r: number, edge: string) {
  for (let j = -r; j <= r; j++) {
    const out = half(r, j), into = half(r - 1, j)
    g.fillStyle = edge
    for (const s of [-1, 1]) g.fillRect(s < 0 ? cx - out : cx + into + 1, cy + j, out - into, 1)
    g.globalAlpha = .84
    g.fillStyle = UI.panel
    if (into >= 0) g.fillRect(cx - into, cy + j, into * 2 + 1, 1)
    g.globalAlpha = 1
  }
}
