import { sound } from '../../audio/player/sound'
import { iris } from '../../core/draw/iris'
import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { OPENING as O } from '../../data/game/opening'
import { H, W } from '../../data/look/screen'
import { brain } from '../dragonfly/brain'
import { run } from './run'
import { G } from './state'

const OPEN = O.lit + O.burst, MOVE = OPEN + O.rest, QUEST = MOVE + O.quest, CONTROL = QUEST + O.control

export const asleep = () => G.start >= 0 && G.start < MOVE
export const bound = () => G.start >= 0
export const born = () => G.start < 0 ? 9 : G.start - QUEST
export const skip = () => G.start = -1

export function alone() {
  const { fly, prey } = run.sim, gap = (x: number, y: number) => Math.min(...prey.list.map(p => Math.hypot(p.x - x, p.y - p.h * .7 - y + fly.h * .7)))
  let best = [fly.x, fly.y], far = gap(fly.x, fly.y)
  for (let d = 10; d <= 120 && far < O.clear; d += 10) for (let a = 0; a < 16; a++) {
    const x = fly.x + Math.cos(a * Math.PI / 8) * d, y = fly.y + Math.sin(a * Math.PI / 8) * d, f = gap(x, y)
    if (f > far && x > O.clear && x < W - O.clear && y > O.clear && y < H - O.clear) [best, far] = [[x, y], f]
  }
  Object.assign(fly, { x: best[0], y: best[1] })
  run.sim.roam = brain(fly)
}

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
