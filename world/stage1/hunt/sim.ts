import { fall, own } from '../../../core/save/save'
import { DF } from '../../../data/dragonfly/body'
import { FIGHT } from '../../../data/dragonfly/fight'
import { cast } from '../../../data/enemies/enemies'
import { HOME, PERCHES } from '../../../data/stage1/map'
import type { Prey } from '../../creatures/prey'
import { swarm } from '../../creatures/swarm'
import { brain } from '../../dragonfly/brain'
import { flight } from '../../dragonfly/flight'
import { effects } from '../effects'

export type Perch = (typeof PERCHES)[number]

export function sim() {
  const fly = flight(HOME.x, HOME.y)
  const s = {
    fly, roam: brain(fly), prey: swarm(cast(1)), fx: effects(), held: null as Prey | null, mark: null as Prey | null, stamina: 100,
    health: own('health'), cap: own('health'), rest: null as Perch | null, bite: 0, extra: 0, hold: 0, strike: 0, hurt: 0, fell: false, away: false,
  }
  const gap = (o: Perch) => Math.hypot(o.x - fly.x, o.y - fly.y)
  return Object.assign(s, {
    gap,
    near: () => PERCHES.reduce((a, b) => gap(b) < gap(a) ? b : a),
    ahead: (d: number) => [fly.x + Math.cos(fly.ang) * d * DF.scale, fly.y + Math.sin(fly.ang) * d * DF.scale],
    leave() {
      s.rest = null
      fly.perched = false
    },
    feast() {
      if (s.held) s.held.free = FIGHT.free
      Object.assign(s, { away: true, held: null, mark: null, rest: null })
      Object.assign(fly, { perched: false, out: true })
    },
    die() {
      Object.assign(s, { held: null, mark: null, fell: true })
      fall()
    },
  })
}

export type Sim = ReturnType<typeof sim>
