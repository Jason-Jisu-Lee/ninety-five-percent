import type { Ctx } from '../../core/screen/canvas'
import { place } from './place'

export function glints(g: Ctx, t: number) {
  const { sparks, look } = place()
  for (const [x, y, len, ph] of sparks) {
    const k = (t * .5 + ph) % 6
    if (k > 2) continue
    g.fillStyle = look.water[k > .5 && k < 1.5 ? 4 : 3]
    g.fillRect(x + Math.floor(k * 2), y, len, 1)
  }
}
