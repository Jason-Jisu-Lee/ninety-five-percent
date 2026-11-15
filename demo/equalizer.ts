import type { Ctx } from '../core/screen/canvas'
import { FOREST as C, UI } from '../data/look/palette'
import { chip } from './chip'
import type { Sound } from './hear'

const N = 7, TALL = 11, bar = Array<number>(N).fill(1), drop = Array<number>(N).fill(0), cap = Array<number>(N).fill(1), hold = Array<number>(N).fill(0)

export function equalizer(g: Ctx, right: number, name: string, s: Sound, dt: number) {
  const x = chip(g, right, name, N * 3 - 1)
  for (let k = 0; k < N; k++) {
    const want = 1 + Math.max(0, (s.bands[k] - .3) / .7) * (TALL - 1)
    if (want >= bar[k]) [bar[k], drop[k]] = [want, 0]
    else bar[k] = Math.max(want, bar[k] - (drop[k] += dt * 90) * dt)
    if (bar[k] >= cap[k]) [cap[k], hold[k]] = [bar[k], .35]
    else if ((hold[k] -= dt) < 0) cap[k] = Math.max(bar[k], cap[k] - dt * 12)
    const h = Math.round(bar[k])
    g.fillStyle = C.g3
    g.fillRect(x + k * 3, 22 - h, 2, h)
    g.fillStyle = UI.accent
    if (h > 4) g.fillRect(x + k * 3, 22 - h, 2, h - 4)
    g.fillStyle = UI.text
    g.fillRect(x + k * 3, 21 - Math.round(cap[k]), 2, 1)
  }
}
