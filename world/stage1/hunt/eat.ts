import { between } from '../../../core/math/between'
import { own, save } from '../../../core/save/save'
import { DF } from '../../../data/dragonfly/body'
import { FIGHT } from '../../../data/dragonfly/fight'
import { PREY } from '../../../data/enemies/enemies'
import { FOREST as C } from '../../../data/look/palette'
import { QUESTS } from '../../../data/stage1/quests'
import { cells } from '../../creatures/draw'
import type { Prey } from '../../creatures/prey'
import type { Sim } from './sim'

export function eat(s: Sim, h: Prey, dt: number, t: number) {
  const { fly, fx } = s, k = PREY[h.kind], [mx, my] = s.ahead(DF.mouth + cells(h) / 2 / DF.scale), bite = own('power'), q = QUESTS[save.quest]
  fly.seek(fly.x, fly.y, 0, dt)
  Object.assign(h, { x: mx, y: my, h: fly.h, ang: fly.ang })
  if (k.power && (s.strike -= dt) <= 0) {
    s.strike = k.strike * between(FIGHT.jitter)
    s.health -= k.power
    s.hurt = FIGHT.flash
    fx.hit(fly.x, fly.y - fly.h * .7 - 16, '-' + k.power, C.pink)
    if (s.health <= 0) return s.die(h)
  }
  if (k.grip && (s.hold += dt) > k.grip) {
    Object.assign(h, { free: FIGHT.free, fear: k.wind, tired: k.wind + k.tire, ang: fly.ang + (Math.random() - .5) * 2 })
    s.held = null
    return s.mind.shun(h, t)
  }
  if (s.bite > 0) return
  s.bite += FIGHT.bite
  h.hp -= bite
  h.flash = .1
  fx.hit(mx, my - fly.h * .7 - 10, String(Math.round(bite)))
  if (h.wings && (!k.grip || h.hp <= 0)) {
    fx.shed(mx, my, fly.h, k.wing)
    h.wings = false
  }
  if (h.hp > 0) return
  save.blood += k.blood
  save.earned += k.blood
  save.caught[h.kind] = (save.caught[h.kind] ?? 0) + 1
  fx.hit(mx, my - fly.h * .7 - 20, '+' + k.blood, C.red)
  if (q?.kind === h.kind && ++save.count >= q.n) [save.quest, save.count] = [save.quest + 1, 0]
  s.prey.kill(h, t)
  s.held = null
  s.mind.settle(s.prey.list, t)
}
