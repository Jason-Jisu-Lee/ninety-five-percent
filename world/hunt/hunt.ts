import { turn } from '../../core/math/angle'
import { between } from '../../core/math/between'
import { clamp } from '../../core/math/clamp'
import { own } from '../../core/save/save'
import { DF } from '../../data/dragonfly/body'
import { FIGHT, LUNGE } from '../../data/dragonfly/fight'
import { CM, FLY, STAMINA } from '../../data/dragonfly/flight'
import { PREY } from '../../data/enemies/enemies'
import { HOME } from '../../data/game/map'
import { eat } from './eat'
import { perch } from './perch'
import { sim } from './sim'

export function hunt() {
  const s = sim(), { fly, prey, fx } = s
  function grab() {
    const [hx, hy] = s.ahead(DF.headAt), p = s.mark
    if (!p || p.free > 0 || Math.hypot(p.x - hx, p.y - hy) >= FLY.catch * own('reach')) return
    const fast = fly.top() / CM >= FIGHT.dive, behind = Math.cos(p.ang - Math.atan2(p.y - fly.y, p.x - fly.x)) > 0
    ;[s.held, s.bite, s.hold, s.strike, s.extra, s.plus] = [p, FIGHT.bite / own('bite'), 0, PREY[p.kind].strike * between(FIGHT.jitter), +fast * own('dive') + +behind * own('ambush') + +s.primed * LUNGE.bonus, +behind * own('prowl') + +s.primed * own('lash')]
    fly.speed = Math.min(fly.speed, FIGHT.slide, s.primed ? fly.top() * LUNGE.skid : Infinity)
    ;[s.jolt, s.lunged, s.used, s.primed, s.boost] = [s.primed, s.primed, false, false, 0]
  }
  return Object.assign(s, {
    idle(dt: number, t: number) {
      prey.step(dt, t, -999, -999, null)
      fly.seek(HOME.x, HOME.y, fly.top() * FLY.cruise, dt)
      fly.step(dt, t)
      fx.step(dt)
    },
    step(dt: number, t: number) {
      const top = fly.top(), cap = own('health')
      prey.step(dt, t, fly.x, fly.y, s.held)
      s.bite -= dt
      s.hurt -= dt
      s.boost -= dt
      s.miss += dt
      s.since += dt
      if (s.mark !== s.aim) [s.aim, s.used, s.primed] = [s.mark, false, false]
      ;[s.health, s.cap] = [s.health + cap - s.cap, cap]
      if (s.mark && !prey.list.includes(s.mark)) s.mark = null
      if (s.away) {
        fly.ang = turn(fly.ang, Math.PI, FLY.swing * dt)
        fly.seek(-99, fly.y, Math.min(top * FLY.dash, FLY.flee), dt)
      }
      else if (s.held) eat(s, s.held, dt, t)
      else if (s.rest) perch(s, s.rest, dt)
      else if (s.mark) fly.chase(s.mark, top * (s.boost > 0 ? LUNGE.speed : 1), dt)
      else s.roam(dt)
      fly.step(dt, t)
      fx.step(dt)
      if (fly.perched || s.away) return
      s.stamina = clamp(s.stamina - STAMINA.drain / own('stamina') * dt, 0, 100)
      if (s.held) {
        if (s.stamina > 0) return
        s.held.free = FIGHT.free
        s.held = null
      }
      s.health = Math.min(cap, s.health + cap * own('mend') / 100 * dt)
      if (s.rest) return
      if (s.stamina <= 0) [s.mark, s.rest, s.spent] = [null, s.near(), true]
      else grab()
    },
  })
}
