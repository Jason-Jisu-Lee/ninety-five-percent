import { own } from '../../../core/save/save'
import { FIGHT } from '../../../data/dragonfly/fight'
import { FLY, STAMINA } from '../../../data/dragonfly/flight'
import type { Perch, Sim } from './sim'

export function perch(s: Sim, r: Perch, dt: number) {
  const { fly } = s, cap = own('health')
  if (!fly.perched && s.gap(r) < 3) Object.assign(fly, { perched: true, speed: 0, x: r.x, y: r.y, base: r.h })
  if (!fly.perched) return fly.seek(r.x, r.y, fly.top() * FLY.cruise * STAMINA.spent, dt, r.h)
  s.stamina = Math.min(100, s.stamina + STAMINA.regen * own('rest') * dt)
  s.health = Math.min(cap, s.health + cap * FIGHT.heal * own('rest') * dt)
  if (s.stamina >= STAMINA.wake) s.leave()
}
