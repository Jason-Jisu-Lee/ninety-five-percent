import { DF, FLY } from '../../data/dragonfly'
import { BITE, POST, PREY } from '../../data/prey'
import { HOME } from '../../data/stage1'
import { flight } from '../dragonfly/flight'
import { cells } from '../prey/draw'
import type { Prey } from '../prey/prey'
import { swarm } from '../prey/swarm'
import { effects } from './effects'

export type Control = 0 | 1 | 2 | 3

export function hunt() {
  const fly = flight(HOME.x, HOME.y), prey = swarm(), fx = effects()
  const s = { fly, prey, fx, control: 0 as Control, energy: 0, held: null as Prey | null, mark: null as Prey | null, post: { ...HOME }, cursor: null as number[] | null, bite: 0, rest: 0 }
  const ahead = (d: number) => [fly.x + Math.cos(fly.ang) * d * DF.scale, fly.y + Math.sin(fly.ang) * d * DF.scale]
  const near = (x: number, y: number, reach: number, lift = 0, list = prey.list) => {
    let best: Prey | null = null
    for (const p of list) {
      const d = Math.hypot(p.x - x, p.y - p.h * lift - y)
      if (d < reach) [best, reach] = [p, d]
    }
    return best
  }
  function eat(h: Prey, dt: number, t: number) {
    const k = PREY[h.kind], [mx, my] = ahead(DF.mouth + cells(h) / 2 / DF.scale)
    fly.seek(fly.x, fly.y, 0, dt)
    Object.assign(h, { x: mx, y: my, h: fly.h, ang: fly.ang })
    if (s.bite > 0) return
    s.bite += BITE.every
    h.hp -= BITE.damage
    h.flash = .1
    fx.hit(mx, my - fly.h * .7 - 12, BITE.damage)
    if (h.wings) fx.shed(mx, my, fly.h, k.wing)
    h.wings = false
    if (h.hp > 0) return
    s.energy += k.energy
    prey.kill(h, t)
    s.held = null
    s.rest = FLY.rest
  }
  function steer(dt: number) {
    const c = s.control, inPost = (p: Prey) => Math.hypot(p.x - s.post.x, p.y - s.post.y) < POST.r
    const goal = c === 2 && s.mark || s.rest <= 0 && c > 1 && near(fly.x, fly.y, 1e9, 0, c === 3 ? prey.list.filter(inPost) : prey.list)
    if (c === 1) s.cursor && fly.seek(s.cursor[0], s.cursor[1] + fly.h * .7, FLY.dart, dt)
    else if (goal) fly.seek(goal.x, goal.y, goal === s.mark ? FLY.dart : FLY.chase, dt, goal.h)
    else if (c === 3) fly.seek(s.post.x, s.post.y, FLY.dart, dt)
    else if (c) fly.seek(fly.x, fly.y, 0, dt)
    else fly.seek(HOME.x, HOME.y, FLY.cruise, dt)
  }
  return Object.assign(s, {
    pick: (x: number, y: number) => near(x, y, 16, .7),
    step(dt: number, t: number) {
      prey.step(dt, t, fly.x, fly.y, s.held)
      if (s.mark && !prey.list.includes(s.mark)) s.mark = null
      s.bite -= dt
      s.rest -= dt
      s.held ? eat(s.held, dt, t) : steer(dt)
      fly.step(dt, t)
      fx.step(dt)
      if (!s.control || s.held) return
      const [hx, hy] = ahead(DF.headAt)
      if (s.held = near(hx, hy, FLY.catch)) s.bite = BITE.every
    },
  })
}
