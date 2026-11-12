import type { Ctx } from '../../core/canvas'
import { rng } from '../../core/rng'
import { H, W } from '../../data/screen'

export function motes() {
  const r = rng(3)
  const list = Array.from({ length: 40 }, () => ({ x: r() * W, y: r() * H, v: .1 + r() * .25, c: r() < .3 ? '#8fc4c2' : '#5f9a95' }))
  return {
    step() {
      for (const m of list) {
        m.x += m.v
        m.y -= m.v * .35
        if (m.x > W) m.x = 0
        if (m.y < 0) m.y = H
      }
    },
    draw(g: Ctx) {
      for (const m of list) {
        g.fillStyle = m.c
        g.fillRect(Math.round(m.x), Math.round(m.y), 1, 1)
      }
    },
  }
}
