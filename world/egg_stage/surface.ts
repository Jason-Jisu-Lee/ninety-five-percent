import type { Ctx } from '../../core/canvas'
import { UI } from '../../data/palette'
import { W } from '../../data/screen'

export function surface(g: Ctx, t: number) {
  for (let x = 0; x < W; x++) {
    g.fillStyle = Math.sin(x * .15 + t * 1.5) + Math.sin(x * .07 - t) > -.5 ? UI.glint : '#4f8a86'
    g.fillRect(x, 12, 1, 1)
  }
  g.fillStyle = '#3b7175'
  g.fillRect(0, 13, W, 1)
}
