import { num } from '../../core/math/num'
import { between } from '../../core/math/between'
import { feed } from '../../core/save/mutate'
import { own, progress, save } from '../../core/save/save'
import { DF } from '../../data/dragonfly/body'
import { FIGHT, STREAK } from '../../data/dragonfly/fight'
import { PREY } from '../../data/enemies/enemies'
import { FOREST as C, ORB } from '../../data/look/palette'
import { cells } from '../creatures/draw'
import type { Prey } from '../creatures/prey'
import type { Sim } from './sim'

export function eat(s: Sim, h: Prey, dt: number, t: number) {
  const { fly, fx } = s, k = PREY[h.kind], [mx, my] = s.ahead(DF.mouth + cells(h) / 2 / DF.scale), bite = own('power') * (1 + s.extra) + s.plus, hit = Math.max(0, k.power - own('armor'))
  fly.seek(fly.x, fly.y, 0, dt)
  Object.assign(h, { x: mx, y: my, h: fly.h, ang: fly.ang })
  if (k.power && (s.strike -= dt) <= 0) {
    s.strike = k.strike * between(FIGHT.jitter)
    s.health -= hit
    s.hurt = FIGHT.flash
    fx.hit(fly.x, fly.y - fly.h * .7 - 16, '-' + num(hit), C.pink)
    if (s.health <= 0) return s.die()
  }
  if (k.grip && (s.hold += dt) > k.grip) {
    Object.assign(h, { free: FIGHT.free, fear: k.wind, tired: k.wind + k.tire, ang: fly.ang + (Math.random() - .5) * 2 })
    s.held = null
    return
  }
  if (s.bite > 0) return
  s.bite += FIGHT.bite / own('bite')
  s.extra = s.plus = 0
  h.hp -= bite
  h.flash = .1
  fx.hit(mx, my - fly.h * .7 - 10, num(bite))
  if (h.wings && (!k.grip || h.hp <= 0)) {
    fx.shed(mx, my, fly.h, k.wing)
    h.wings = false
  }
  if (h.hp > 0) return
  s.chain = own('streak') && s.since < STREAK.time ? Math.min(STREAK.step * (own('streak') + 1), s.chain + STREAK.step) : 0
  s.since = 0
  const pay = +(k.blood * (h.gold ? own('rich') : 1) * (1 + s.chain)).toFixed(2)
  save.blood += pay
  feed(pay)
  save.earned += pay
  save.caught[h.kind] = (save.caught[h.kind] ?? 0) + 1
  fx.hit(mx, my - fly.h * .7 - 20, '+' + Math.round(pay), ORB['#'])
  progress(h.kind)
  if (s.lunged) progress('lunge')
  s.prey.kill(h, t)
  s.held = null
  if (s.mark === h) s.mark = null
}
