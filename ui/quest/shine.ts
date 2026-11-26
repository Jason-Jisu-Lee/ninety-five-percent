import type { Ctx } from '../../core/screen/canvas'
import { W } from '../../data/look/screen'
import { blank } from './pop'

export function shine(g: Ctx, v: number, draw: (g: Ctx) => void, left: number, wide: number, top: number, tall: number) {
  if (v <= 0 || v >= 1) return
  const tmp = blank(draw)
  for (let j = 0; j < tall; j++) {
    const x = Math.round(left - 16 + v * (wide + 46) - j * .5)
    tmp.clearRect(0, top + j, x, 1)
    tmp.clearRect(x + 8, top + j, 2, 1)
    tmp.clearRect(x + 12, top + j, W, 1)
  }
  g.drawImage(tmp.canvas, 0, top, W, tall, 0, top, W, tall)
}
