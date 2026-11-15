import type { Ctx } from '../../../core/screen/canvas'
import { once } from '../../../core/math/once'
import { rng } from '../../../core/math/rng'
import { FOREST as C } from '../../../data/look/palette'
import { H } from '../../../data/look/screen'
import { depth, onPad } from './pond'

const spots = once(() => {
  const R = rng(5), out: { x: number; y: number; len: number; ph: number }[] = []
  while (out.length < 12) {
    const x = R() * 310 | 0, y = 222 + R() * (H - 222) | 0, len = 3 + (R() * 4 | 0)
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
