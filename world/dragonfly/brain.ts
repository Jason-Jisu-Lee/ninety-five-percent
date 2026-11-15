import { wrap } from '../../core/angle'
import { AUTO, FLY } from '../../data/dragonfly'
import { H, W } from '../../data/screen'
import { PREY } from '../../data/stage1/enemies'
import type { Prey } from '../creatures/prey'
import type { Flight } from './flight'

export function brain(fly: Flight) {
  const R = Math.random, shy = new WeakMap<Prey, number>(), between = ([a, b]: number[]) => a + R() * (b - a)
  let target: Prey | null = null, moving = false, until = 0, look = 0, calm = 0, quit = 0, gx = fly.x, gy = fly.y, gh = FLY.height, pace = FLY.cruise, sway = 0, rate = 1, face = fly.ang
  function pause(t: number, d: number) {
    moving = false
    until = t + d
    face = fly.ang + (R() - .5) * 3.4
  }
  function settle(t: number) {
    target = null
    calm = t + between(AUTO.calm)
    pause(t, .3 + R() * .7)
  }
  function shun(p: Prey, t: number) {
    shy.set(p, t + AUTO.shun)
    settle(t)
  }
  function roam(t: number) {
    const r = R(), a = fly.ang + (R() - .5) * 2.6, d = 45 + R() * 75
    const [x, y] = r < AUTO.far ? [R() * W, R() * H] : [fly.x + Math.cos(a) * d, fly.y + Math.sin(a) * d]
    gx = Math.min(Math.max(x, 30), W - 30)
    gy = Math.min(Math.max(y, 44), H - 14)
    gh = FLY.height * (.75 + R() * .6)
    pace = r > 1 - AUTO.dart ? 1 : FLY.cruise * (.8 + R() * .5)
    sway = (R() - .5) * 50
    rate = 1.2 + R() * 1.6
    moving = true
    until = t + 6
  }
  function spot(list: Prey[], t: number) {
    let best: Prey | null = null, near = AUTO.sight
    for (const p of list) {
      const dx = p.x - fly.x, dy = p.y - fly.y
      if (PREY[p.kind].tier > AUTO.tier || p.free > 0 || (shy.get(p) ?? 0) > t) continue
      const d = Math.hypot(dx, dy) * (Math.cos(wrap(Math.atan2(dy, dx) - fly.ang)) < -.5 ? 2 : 1) * (.7 + R() * .6)
      if (d < near) [best, near] = [p, d]
    }
    return best
  }
  return {
    shun,
    settle,
    step(dt: number, t: number, list: Prey[]) {
      const top = fly.top()
      if (target && !list.includes(target)) settle(t)
      if (!target && t > calm && (look -= dt) <= 0) {
        look = .12 + R() * .16
        if (target = spot(list, t)) quit = t + between(AUTO.patience)
      }
      if (target) {
        if (t > quit || target.free > 0) return shun(target, t)
        const lead = Math.min(.8, Math.hypot(target.x - fly.x, target.y - fly.y) / top)
        return fly.seek(target.x + target.vx * lead, target.y + target.vy * lead, top * AUTO.chase, dt, target.h)
      }
      if (!moving) {
        fly.seek(fly.x + Math.cos(face) * 40, fly.y + Math.sin(face) * 40, 0, dt, gh)
        if (t > until) roam(t)
        return
      }
      const dx = gx - fly.x, dy = gy - fly.y, d = Math.hypot(dx, dy) || 1, k = Math.sin(t * rate) * sway * Math.min(1, d / 90)
      fly.seek(gx - dy / d * k, gy + dx / d * k, top * pace, dt, gh)
      if (d < 14 || t > until) pause(t, .3 + R() * R() * 2.4)
    },
  }
}
