import { fall, own } from '../../../core/save/save'
import { AUTO } from '../../../data/dragonfly/auto'
import { DF } from '../../../data/dragonfly/body'
import { FIGHT } from '../../../data/dragonfly/fight'
import { FLY, STAMINA } from '../../../data/dragonfly/flight'
import { cast } from '../../../data/enemies/enemies'
import { HOME, PERCHES } from '../../../data/stage1/map'
import type { Prey } from '../../creatures/prey'
import { swarm } from '../../creatures/swarm'
import { brain } from '../../dragonfly/brain'
import { flight } from '../../dragonfly/flight'
import { effects } from '../effects'

export type Perch = (typeof PERCHES)[number]

export function sim() {
  const fly = flight(HOME.x, HOME.y), mind = brain(fly)
  const s = {
    fly, mind, prey: swarm(cast(1)), fx: effects(), held: null as Prey | null, mark: null as Prey | null, sel: !AUTO.on, shown: 0, stamina: 100,
    health: own('health'), cap: own('health'), rest: null as Perch | null, cursor: [HOME.x, HOME.y], bite: 0, hold: 0, strike: 0, hurt: 0, fell: false,
  }
  const gap = (o: Perch) => Math.hypot(o.x - fly.x, o.y - fly.y), near = () => [...PERCHES].sort((a, b) => gap(a) - gap(b))
  const ahead = (d: number) => [fly.x + Math.cos(fly.ang) * d * DF.scale, fly.y + Math.sin(fly.ang) * d * DF.scale]
  return Object.assign(s, {
    gap,
    near,
    ahead,
    perchAt: (x: number, y: number) => PERCHES.find(p => Math.hypot(p.x - x, p.y - p.h * .7 - y) < 10) ?? null,
    onFly: (x: number, y: number) => Math.hypot(ahead(DF.mid)[0] - x, ahead(DF.mid)[1] - fly.h * .7 - y) < FLY.reach,
    free: () => AUTO.on && (s.sel || !s.rest || s.stamina >= STAMINA.wake),
    pick: () => near()[mind.roam() ? 1 + Math.random() * (PERCHES.length - 1) | 0 : +(Math.random() > AUTO.home)],
    leave() {
      s.rest = null
      fly.perched = false
    },
    die(h?: Prey) {
      if (h) h.free = FIGHT.free
      Object.assign(fly, { x: HOME.x, y: HOME.y, speed: 0, perched: false })
      Object.assign(s, { held: null, mark: null, sel: !AUTO.on, rest: null, stamina: 100, fell: true })
      fall()
      s.health = s.cap = own('health')
    },
  })
}

export type Sim = ReturnType<typeof sim>
