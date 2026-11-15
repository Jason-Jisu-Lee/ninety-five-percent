import { FLY, HUNT } from '../../data/dragonfly'
import { PREY } from '../../data/prey'
import { H, W } from '../../data/screen'
import { HAUNTS } from '../../data/stage1'
import { wrap } from '../../core/angle'
import type { Prey } from '../prey/prey'
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
    calm = t + between(HUNT.calm)
    pause(t, .3 + R() * .7)
  }
  function shun(p: Prey, t: number) {
    shy.set(p, t + HUNT.shun)
    settle(t)
  }
  function roam(t: number) {
    const r = R(), a = fly.ang + (R() - .5) * 2.6, d = 50 + R() * 80, [hx, hy] = HAUNTS[R() * HAUNTS.length | 0]
    const [x, y] = r < .4 ? [hx + (R() - .5) * 80, hy + (R() - .5) * 60] : r < .58 ? [W - fly.x + (R() - .5) * 160, H - fly.y + (R() - .5) * 100] : [fly.x + Math.cos(a) * d, fly.y + Math.sin(a) * d]
    gx = Math.min(Math.max(x, 30), W - 30)
    gy = Math.min(Math.max(y, 44), H - 14)
    gh = FLY.height * (.75 + R() * .6)
    pace = r > .9 ? 1 : FLY.cruise * (.8 + R() * .5)
    sway = (R() - .5) * 56
    rate = 1.2 + R() * 1.6
    moving = true
    until = t + 6
  }
  function spot(list: Prey[], t: number, top: number) {
    let best: Prey | null = null, most = 0
    for (const p of list) {
      const k = PREY[p.kind], dx = p.x - fly.x, dy = p.y - fly.y, d = Math.hypot(dx, dy)
      if (d > HUNT.sight || p.free > 0 || (shy.get(p) ?? 0) > t) continue
      const score = k.energy / (d / top + .5 + k.wary) * (Math.cos(wrap(Math.atan2(dy, dx) - fly.ang)) < -.5 ? .5 : 1) * (.6 + R() * .8)
      if (score > most) [best, most] = [p, score]
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
        if (target = spot(list, t, top)) quit = t + between(HUNT.patience)
      }
      if (target) {
        if (t > quit || target.free > 0) return shun(target, t)
        const lead = Math.min(.8, Math.hypot(target.x - fly.x, target.y - fly.y) / top)
        return fly.seek(target.x + target.vx * lead, target.y + target.vy * lead, top, dt, target.h)
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
