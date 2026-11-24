import { sound } from '../../audio/player/sound'
import { iris } from '../../core/draw/iris'
import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { OPENING as O } from '../../data/game/opening'
import { H, W } from '../../data/look/screen'
import { run } from './run'
import { G } from './state'

const OPEN = O.lit + O.burst, MOVE = OPEN + O.rest, QUEST = MOVE + O.quest, CONTROL = QUEST + O.control

export const asleep = () => G.start >= 0 && G.start < MOVE
export const bound = () => G.start >= 0
export const born = () => G.start < 0 ? 9 : G.start - QUEST
export const skip = () => G.start = -1

export function advance(dt: number) {
  const was = G.start
  if (was < 0) return false
  G.start += dt
  if (was < QUEST && G.start >= QUEST) sound('cork')
  if (G.start >= CONTROL) skip()
  return was < MOVE
}

export function reveal(g: Ctx, k: number) {
  if (G.start < 0 || G.start >= OPEN) return
  const { fly } = run.sim, x = fly.x, y = fly.y - fly.h * .7, far = (Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 2) * O.band / (O.band - 1)
  const pull = clamp((G.start - O.lit + O.pull) / O.pull), tight = O.radius * (1 - O.tight * pull * pull * (3 - 2 * pull)), r = tight + (far - tight) * clamp((G.start - O.lit) / O.burst) ** 4
  g.imageSmoothingEnabled = false
  g.drawImage(iris(x, y, r, r / O.band, Math.min(1, G.start / O.show)), 0, 0, W * k, H * k)
}
