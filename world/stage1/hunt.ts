import { save } from '../../core/save'
import { AUTO, DF, FLY, GLOW, STAMINA } from '../../data/dragonfly'
import { FOREST as C } from '../../data/palette'
import { BITE, FREE, PREY } from '../../data/stage1/enemies'
import { QUESTS } from '../../data/stage1/quests'
import { HOME, PERCHES } from '../../data/stage1/scene'
import { boost } from '../../data/stats'
import { brain } from '../dragonfly/brain'
import { flight } from '../dragonfly/flight'
import { cells } from '../creatures/draw'
import type { Prey } from '../creatures/prey'
import { swarm } from '../creatures/swarm'
import { effects } from './effects'

export type Perch = (typeof PERCHES)[number]

export function hunt() {
  const fly = flight(HOME.x, HOME.y), prey = swarm(), fx = effects(), mind = brain(fly)
  const s = { fly, prey, fx, held: null as Prey | null, sel: false, glow: 0, stamina: 100, rest: null as Perch | null, cursor: [HOME.x, HOME.y], bite: 0, hold: 0 }
  const ahead = (d: number) => [fly.x + Math.cos(fly.ang) * d * DF.scale, fly.y + Math.sin(fly.ang) * d * DF.scale]
  const gap = (o: Perch) => Math.hypot(o.x - fly.x, o.y - fly.y)
  const over = (o: Perch, x: number, y: number, r: number) => Math.hypot(o.x - x, o.y - o.h * .7 - y) < r
  const perches = () => [...PERCHES].sort((a, b) => gap(a) - gap(b))
  const perchAt = (x: number, y: number) => PERCHES.find(p => over(p, x, y, 11)) ?? null
  const onFly = (x: number, y: number) => Math.hypot(ahead(-3.3)[0] - x, ahead(-3.3)[1] - fly.h * .7 - y) < FLY.reach
  function leave() {
    s.rest = null
    fly.perched = false
  }
  function eat(h: Prey, dt: number, t: number) {
    const k = PREY[h.kind], [mx, my] = ahead(DF.mouth + cells(h) / 2 / DF.scale), bite = save.lv.power, q = QUESTS[save.quest]
    fly.seek(fly.x, fly.y, 0, dt)
    Object.assign(h, { x: mx, y: my, h: fly.h, ang: fly.ang })
    if (k.grip && (s.hold += dt) > k.grip) {
      Object.assign(h, { free: FREE, fear: k.wind, tired: k.wind + k.tire, ang: fly.ang + (Math.random() - .5) * 2 })
      s.held = null
      return mind.shun(h, t)
    }
    if (s.bite > 0) return
    s.bite += BITE.every
    h.hp -= bite
    h.flash = .1
    fx.hit(mx, my - fly.h * .7 - 10, String(bite))
    if (h.wings && (!k.grip || h.hp <= 0)) {
      fx.shed(mx, my, fly.h, k.wing)
      h.wings = false
    }
    if (h.hp > 0) return
    save.energy += k.energy
    fx.hit(mx, my - fly.h * .7 - 20, '+' + k.energy, C.yellow)
    if (q?.kind === h.kind && ++save.count >= q.n) [save.quest, save.count] = [save.quest + 1, 0]
    prey.kill(h, t)
    s.held = null
    mind.settle(t)
  }
  function perch(r: Perch, top: number, dt: number) {
    if (!fly.perched && gap(r) < 3) Object.assign(fly, { perched: true, speed: 0, x: r.x, y: r.y, base: r.h })
    if (!fly.perched) return fly.seek(r.x, r.y, top * (s.sel ? 1 : FLY.cruise) * (s.stamina > 0 ? 1 : STAMINA.spent), dt, r.h)
    s.stamina = Math.min(100, s.stamina + STAMINA.regen * dt)
    if (!s.sel && s.stamina >= STAMINA.wake) leave()
  }
  return Object.assign(s, {
    perchAt,
    onFly,
    click(x: number, y: number) {
      const at = perchAt(x, y), was = s.rest
      s.cursor = [x, y]
      if (s.sel && (was || at)) {
        leave()
        s.rest = at === was ? null : at
      } else if (onFly(x, y) && (s.sel || !was)) [s.sel, s.glow] = [!s.sel, GLOW]
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
      s.glow -= dt
      if (s.held) eat(s.held, dt, t)
      else if (s.rest) perch(s.rest, top, dt)
      else if (s.sel) {
        fly.seek(s.cursor[0], s.cursor[1] + fly.h * .7, top, dt)
        if (s.stamina <= 0) [s.sel, s.rest] = [false, perches()[0]]
      } else if (s.stamina < STAMINA.tired) s.rest = perches()[Math.random() < .25 ? 1 : 0]
      else mind.step(dt, t, prey.list)
      fly.step(dt, t)
      fx.step(dt)
      if (fly.perched || s.held) return
      s.stamina = Math.max(0, s.stamina - (STAMINA.hover + (STAMINA.sprint - STAMINA.hover) * Math.min(1, fly.speed / top)) / boost('stamina', save.lv.stamina) * dt)
      if (s.rest) return
      const [hx, hy] = ahead(DF.headAt)
      let reach = FLY.catch
      for (const p of prey.list) {
        const d = Math.hypot(p.x - hx, p.y - hy)
        if (d < reach && p.free <= 0 && (s.sel || PREY[p.kind].tier <= AUTO.tier)) [s.held, reach] = [p, d]
      }
      if (s.held) [s.bite, s.hold] = [BITE.every, 0]
    },
  })
}
