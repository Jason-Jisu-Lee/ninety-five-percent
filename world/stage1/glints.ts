import type { Ctx } from '../../core/canvas'
import { once } from '../../core/once'
import { rng } from '../../core/rng'
import { FOREST as C } from '../../data/palette'
import { H } from '../../data/screen'
import { depth, onPad } from './pond'

const spots = once(() => {
  const R = rng(5), out: { x: number; y: number; len: number; ph: number }[] = []
  while (out.length < 9) {
    const x = R() * 190 | 0, y = 215 + R() * (H - 215) | 0, len = 3 + (R() * 5 | 0)
    if (depth(x, y) > 14 && depth(x + len + 4, y) > 14 && !onPad(x - 6, y - 6) && !onPad(x + len + 6, y)) out.push({ x, y, len, ph: R() * 6 })
  }
  return out
})

export function glints(g: Ctx, t: number) {
  for (const s of spots()) {
    const k = (t * .5 + s.ph) % 6
    if (k > 2) continue
    g.fillStyle = k > .5 && k < 1.5 ? C.glint : C.wSh
    g.fillRect(s.x + Math.floor(k * 2), s.y, s.len, 1)
  }
}
