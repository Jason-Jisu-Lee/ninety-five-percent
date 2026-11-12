import type { Ctx } from '../../core/canvas'
import { rng } from '../../core/rng'

export function motes() {
  const r = rng(4), list = Array.from({ length: 18 }, () => ({ x: r() * 380, y: 20 + r() * 190, v: .05 + r() * .1 }))
  return {
    step() {
      for (const m of list) if ((m.y -= m.v) < 16) {
        m.y = 210
        m.x = r() * 380
      }
    },
    draw(g: Ctx, t: number) {
      g.fillStyle = '#6fa6a2'
      for (const m of list) g.fillRect(Math.round(m.x + Math.sin(t + m.v * 50)), Math.round(m.y), 1, 1)
    },
  }
}
