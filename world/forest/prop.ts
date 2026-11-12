import type { Ctx } from '../../core/canvas'
import { FOREST as C } from '../../data/palette'
import type { Prop } from './props'
import { flowers, tuftHeight, tufts } from './sprites'

export function prop(g: Ctx, p: Prop, lean: number) {
  if (p.k === 'tuft') return g.drawImage(tufts()[p.v][p.col][lean], p.x, p.y - tuftHeight(p.v) + 1)
  if (p.k === 'flower') {
    const s = flowers()[p.kind][p.bud]
    return g.drawImage(s, p.x - (s.width >> 1) + (lean ? 1 : 0), p.y - s.height + 1)
  }
  for (let i = 0; i < p.h; i++) {
    const x = p.x + Math.round(lean * (i / p.h) ** 2 * 1.5), y = p.y - i, head = p.cat && i >= p.h - 6 && i <= p.h - 2
    g.fillStyle = head ? C.t0 : i < 3 ? C.g0 : i === p.h - 1 ? C.g3 : C.g2
    g.fillRect(x, y, 1, 1)
    if (head) {
      g.fillStyle = C.t1
      g.fillRect(x + 1, y, 1, 1)
    }
    if (!p.husk || i < 9 || i > 11) continue
    g.fillStyle = i === 11 ? C.seed : C.husk
    g.fillRect(x + 1, y, i === 10 ? 2 : 1, 1)
  }
}
