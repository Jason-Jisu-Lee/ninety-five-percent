import type { Pixels } from '../../core/pixels'
import { PADS, ROCKS } from '../../data/forest'
import { FOREST as C } from '../../data/palette'
import { W } from '../../data/screen'
import { river } from './river'

export function decor(p: Pixels, free: Uint8Array) {
  const { path, bank } = river()
  for (const [frac, d, bloom] of PADS) {
    const q = path[Math.floor(frac * (path.length - 1))], cx = Math.round(q.x + q.nx * d), cy = Math.round(q.y + q.ny * d)
    for (let dy = -2; dy <= 2; dy++) for (let dx = -4; dx <= 4; dx++) {
      if ((dx / 4.4) ** 2 + (dy / 2.6) ** 2 > 1 || dx >= 2 && dy === 0) continue
      p.set(cx + dx, cy + dy, dy < 0 && dx < 2 ? C.g3 : C.g2)
      free[(cy + dy) * W + cx + dx] = 0
    }
    if (!bloom) continue
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) p.set(cx - 1 + dx, cy + dy, C.pink)
    p.set(cx - 1, cy, C.white)
  }
  for (const [frac, side, rx, ry] of ROCKS) {
    const [cx, cy] = bank(frac, side, 5), in1 = (dx: number, dy: number) => (dx / (rx + .4)) ** 2 + (dy / (ry + .4)) ** 2 <= 1
    for (let dy = -ry; dy <= ry; dy++) for (let dx = -rx; dx <= rx; dx++) {
      if (in1(dx, dy)) p.set(cx + dx, cy + dy, !in1(dx + 1, dy + 1) ? C.r0 : dx + dy < -1 ? C.r2 : C.r1)
    }
  }
}
