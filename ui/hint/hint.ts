import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import type { Prey } from '../../world/creatures/prey'
import { span } from '../../world/creatures/span'
import type { Sim } from '../../world/hunt/sim'
import { chevron } from '../parts/chevron'
import { key } from '../parts/key'
import { marks } from '../parts/marks'

const BEAT = 1.2, CLOSE = .4, WIDE = 9
let aim: Prey | null = null
const off = (p: Prey) => Math.hypot(p.x - W / 2, p.y - H / 2)

export function hint(g: Ctx, sim: Sim, hot: Prey | null, t: number) {
  const c = t % BEAT, list = sim.prey.list
  if (hot || sim.mark || sim.held || sim.away) return
  if (!aim || !list.includes(aim)) aim = list.filter(p => p.kind === 'fruitfly').reduce<Prey | null>((a, b) => !a || off(b) < off(a) ? b : a, null)
  if (!aim) return
  const x = Math.round(aim.x), y = Math.round(aim.y - aim.h * .7), r = span(aim), up = y - r - 28 > 30, bob = +(c > BEAT / 2)
  marks(g, x, y, r + Math.round(WIDE * (1 - Math.min(1, c / CLOSE)) ** 2), UI.text)
  chevron(g, x - 2, up ? y - r - 8 : y + r + 8, up ? 1 : -1)
  key(g, x - 5, up ? y - r - 24 - bob : y + r + 12 + bob)
}
