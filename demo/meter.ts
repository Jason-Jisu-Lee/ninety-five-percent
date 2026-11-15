import type { Ctx } from '../core/screen/canvas'
import { FOREST as C, UI } from '../data/look/palette'
import { chip } from './chip'
import type { Sound } from './hear'

const N = 11, lit = [0, 0], peak = [0, 0], hold = [0, 0]

export function meter(g: Ctx, right: number, name: string, { bands: b }: Sound, dt: number) {
  const x = chip(g, right, name, N * 3 - 1), want = [(b[0] + b[1] + b[2]) / 3, (b[3] + b[4] + b[5] + b[6]) / 4]
  for (const r of [0, 1]) {
    const v = Math.max(0, (want[r] - .3) / .7) * N
    lit[r] = v > lit[r] ? v : Math.max(v, lit[r] - dt * 24)
    if (lit[r] >= peak[r]) [peak[r], hold[r]] = [lit[r], .5]
    else if ((hold[r] -= dt) < 0) peak[r] = Math.max(lit[r], peak[r] - dt * 14)
    for (let i = 0; i < N; i++) {
      g.fillStyle = i < Math.round(lit[r]) || i === Math.round(peak[r]) - 1 ? i < 7 ? UI.accent : i < 10 ? C.yellow : C.red : C.t2
      g.fillRect(x + i * 3, 11 + r * 6, 2, 4)
    }
  }
}
