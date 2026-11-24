import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import type { Prey } from '../../world/creatures/prey'
import { span } from '../../world/creatures/span'
import type { Sim } from '../../world/hunt/sim'
import { key } from '../parts/key'
import { marks } from '../parts/marks'

const BEAT = 1.2, CLOSE = .4, WIDE = 9, V = [[0, 0], [1, 1], [2, 2], [3, 1], [4, 0]]
let aim: Prey | null = null, was = 0

function chevron(g: Ctx, x: number, y: number, way: number) {
  for (let n = 0; n < 10; n++) {
    g.fillStyle = n < 9 ? UI.panel : UI.text
    for (const [i, j] of V) g.fillRect(x + i + (n < 9 ? n % 3 - 1 : 0), y + j * way + (n < 9 ? (n / 3 | 0) - 1 : 0), 1, 1)
  }
}

export function hint(g: Ctx, sim: Sim, hot: Prey | null, t: number) {
  const c = t % BEAT, list = sim.prey.list
  if (hot || sim.mark || sim.held || sim.away) return
  if (!aim || !list.includes(aim) || c < was) aim = list.filter(p => p.kind === 'fruitfly' && p.x > 20 && p.x < W - 20 && p.y > 40 && p.y < H - 20).reduce<Prey | null>((a, b) => !a || sim.gap(b) < sim.gap(a) ? b : a, null)
  was = c
  if (!aim) return
  const x = Math.round(aim.x), y = Math.round(aim.y - aim.h * .7), r = span(aim), up = y - r - 28 > 30, bob = +(c > BEAT / 2)
  marks(g, x, y, r + Math.round(WIDE * (1 - Math.min(1, c / CLOSE)) ** 2), UI.text)
  chevron(g, x - 2, up ? y - r - 8 : y + r + 8, up ? 1 : -1)
  key(g, x - 5, up ? y - r - 24 - bob : y + r + 12 + bob)
}
