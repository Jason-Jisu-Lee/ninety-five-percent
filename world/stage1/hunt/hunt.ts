import { save } from '../../../core/save/save'
import { AUTO } from '../../../data/dragonfly/auto'
import { DF } from '../../../data/dragonfly/body'
import { FLY, SHOWN, STAMINA } from '../../../data/dragonfly/flight'
import { boost } from '../../../data/dragonfly/stats'
import { BITE, PREY } from '../../../data/stage1/enemies'
import { HOME } from '../../../data/stage1/map'
import { eat } from './eat'
import { perch } from './perch'
import { sim } from './sim'

export function hunt() {
  const s = sim(), { fly, prey, fx, mind } = s
  function grab() {
    const [hx, hy] = s.ahead(DF.headAt)
    let reach = FLY.catch
    for (const p of prey.list) {
      const d = Math.hypot(p.x - hx, p.y - hy)
      if (d < reach && p.free <= 0 && (s.sel || PREY[p.kind].tier <= AUTO.tier)) [s.held, reach] = [p, d]
    }
    if (s.held) [s.bite, s.hold] = [BITE.every, 0]
  }
  return Object.assign(s, {
    click(x: number, y: number) {
      const at = s.perchAt(x, y), was = s.rest
      s.cursor = [x, y]
      if (s.sel && (was || at)) {
        s.leave()
        s.rest = at === was ? null : at
      } else if (s.onFly(x, y) && s.free()) {
        ;[s.sel, s.shown] = [!s.sel, SHOWN]
        if (s.sel) s.leave()
      }
    },
    idle(dt: number, t: number) {
      prey.step(dt, t, -999, -999, null)
      fly.seek(HOME.x, HOME.y, fly.top() * FLY.cruise, dt)
      fly.step(dt, t)
      fx.step(dt)
    },
    step(dt: number, t: number) {
      const top = fly.top()
      prey.step(dt, t, fly.x, fly.y, s.held)
      s.bite -= dt
      s.shown -= dt
      if (s.held) eat(s, s.held, dt, t)
      else if (s.rest) perch(s, s.rest, dt, t)
      else if (s.sel) {
        fly.seek(s.cursor[0], s.cursor[1] + fly.h * .7, top, dt)
        if (s.stamina <= 0) [s.sel, s.rest] = [false, s.near()[0]]
      } else if (s.stamina < STAMINA.tired || !mind.step(dt, t, prey.list)) s.rest = s.pick()
      fly.step(dt, t)
      fx.step(dt)
      if (fly.perched || s.held) return
      s.stamina = Math.max(0, s.stamina - (STAMINA.hover + (STAMINA.sprint - STAMINA.hover) * Math.min(1, fly.speed / top)) / boost('stamina', save.lv.stamina) * dt)
      if (!s.rest) grab()
    },
  })
}
