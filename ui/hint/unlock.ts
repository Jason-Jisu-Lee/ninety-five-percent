import type { Ctx } from '../../core/screen/canvas'
import { NEWS as N } from '../../data/game/hints'
import { banner } from '../parts/banner'
import { brackets } from '../parts/brackets'
import { SLOTS } from '../wild/next'

export function unlocked(g: Ctx, u: number) {
  brackets(g, SLOTS, 2 + Math.round(7 * (1 - Math.min(1, u % 1.2 / .4)) ** 2))
  banner(g, N.title, N.lines, u, N.hold)
}
