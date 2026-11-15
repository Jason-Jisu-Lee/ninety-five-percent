import { wrap } from '../../core/math/angle'
import { between } from '../../core/math/between'
import { AUTO } from '../../data/dragonfly/auto'
import { PREY } from '../../data/enemies/enemies'
import type { Prey } from '../creatures/prey'
import type { Flight } from './flight'

export function brain(fly: Flight) {
  const R = Math.random, shy = new WeakMap<Prey, number>()
  let target: Prey | null = null, look = 0, calm = 0, bored = 0, quit = 0, chain = 0, far = false
  function spot(list: Prey[], t: number, sight: number) {
    let best: Prey | null = null, near = sight
    for (const p of list) {
      const dx = p.x - fly.x, dy = p.y - fly.y
      if (PREY[p.kind].tier > AUTO.tier || p.free > 0 || (shy.get(p) ?? 0) > t) continue
      const d = Math.hypot(dx, dy) * (!fly.perched && Math.cos(wrap(Math.atan2(dy, dx) - fly.ang)) < -.5 ? 2 : 1) * (.7 + R() * .6)
      if (d < near) [best, near] = [p, d]
    }
    return best
  }
  function chase(p: Prey | null, t: number) {
    target = p
    quit = t + between(AUTO.patience)
    return !!p
  }
  return {
    shun(p: Prey, t: number) {
      shy.set(p, t + AUTO.shun)
      target = null
    },
    settle: (list: Prey[], t: number) => chase(chain++ < AUTO.chain ? spot(list, t, AUTO.near) : null, t),
    land(t: number) {
      calm = t + between(AUTO.sit)
      bored = t + between(AUTO.bored)
      chain = 0
    },
    sit(dt: number, t: number, list: Prey[]) {
      if (t < calm || (look -= dt) > 0) return false
      look = .12 + R() * .16
      return chase(spot(list, t, AUTO.sight), t) || (far = t > bored)
    },
    roam() {
      const was = far
      far = false
      return was
    },
    step(dt: number, t: number, list: Prey[]) {
      if (target && (t > quit || target.free > 0)) shy.set(target, t + AUTO.shun)
      if (!target || !list.includes(target) || shy.has(target) && shy.get(target)! > t) return !!(target = null)
      const top = fly.top(), lead = Math.min(.8, Math.hypot(target.x - fly.x, target.y - fly.y) / top)
      fly.seek(target.x + target.vx * lead, target.y + target.vy * lead, top * AUTO.chase, dt, target.h)
      return true
    },
  }
}
