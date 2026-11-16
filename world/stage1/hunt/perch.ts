import { own } from '../../../core/save/save'
import { AUTO } from '../../../data/dragonfly/auto'
import { FIGHT } from '../../../data/dragonfly/fight'
import { FLY, STAMINA } from '../../../data/dragonfly/flight'
import type { Perch, Sim } from './sim'

export function perch(s: Sim, r: Perch, dt: number, t: number) {
  const { fly } = s, cap = own('health')
  if (!fly.perched && s.gap(r) < 3) {
    Object.assign(fly, { perched: true, speed: 0, x: r.x, y: r.y, base: r.h })
    s.mind.land(t)
  }
  if (!fly.perched) return fly.seek(r.x, r.y, fly.top() * (s.sel ? 1 : FLY.cruise) * (s.stamina > 0 ? 1 : STAMINA.spent), dt, r.h)
  s.stamina = Math.min(100, s.stamina + STAMINA.regen * dt)
  s.health = Math.min(cap, s.health + cap * FIGHT.heal * dt)
  if (s.sel || s.stamina < STAMINA.wake) return
  if (!AUTO.on) s.sel = true
  else if (s.mind.sit(dt, t, s.prey.list)) s.leave()
}
