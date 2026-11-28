import { fall, own } from '../../core/save/save'
import { roster } from '../../core/save/wild'
import { DF } from '../../data/dragonfly/body'
import { FIGHT, LUNGE } from '../../data/dragonfly/fight'
import { FLY } from '../../data/dragonfly/flight'
import { HOME } from '../../data/game/map'
import type { Prey } from '../creatures/prey'
import { swarm } from '../creatures/swarm'
import { brain } from '../dragonfly/brain'
import { flight } from '../dragonfly/flight'
import { effects } from '../game/effects'
import type { Perch } from '../place/kit'
import { place, where } from '../place/place'

export function sim() {
  const fly = flight(HOME.x, HOME.y)
  const s = {
    fly, roam: brain(fly), prey: swarm(roster(where.stage)), fx: effects(), held: null as Prey | null, mark: null as Prey | null, stamina: 100,
    health: own('health'), cap: own('health'), rest: null as Perch | null, bite: 0, extra: 0, plus: 0, hold: 0, strike: 0, hurt: 0, fell: false, away: false, onward: false,
    aim: null as Prey | null, hand: false, used: false, primed: false, jolt: false, lunged: false, spent: false, miss: 9, boost: 0, tight: 0, chain: 0, since: 99,
  }
  const gap = (o: Perch) => Math.hypot(o.x - fly.x, o.y - fly.y), ahead = (d: number) => [fly.x + Math.cos(fly.ang) * d * DF.scale, fly.y + Math.sin(fly.ang) * d * DF.scale]
  const span = () => s.mark ? Math.hypot(s.mark.x - ahead(DF.headAt)[0], s.mark.y - ahead(DF.headAt)[1]) : 0
  const fit = () => {
    if (!s.mark) return false
    const [x, y] = fly.aim(s.mark), off = Math.atan2(y - fly.y, x - fly.x) - fly.ang
    return span() <= LUNGE.far && Math.cos(off) > 0 && (fly.reach(x, y) >= fly.top() * LUNGE.speed || Math.hypot(x - fly.x, y - fly.y) * Math.abs(Math.sin(off)) < FLY.catch * own('reach'))
  }
  return Object.assign(s, {
    gap, ahead, span, fit,
    near: () => place().perches.reduce((a, b) => gap(b) < gap(a) ? b : a),
    leave() {
      s.rest = null
      fly.perched = false
    },
    dart() {
      if (!own('lunge') || !s.mark || s.held || s.rest || s.primed) return
      if (s.used || !fit()) return void ([s.used, s.miss] = [true, 0])
      ;[s.used, s.primed, s.boost, s.tight] = [true, true, LUNGE.time, span()]
      fly.speed = fly.top() * LUNGE.speed
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
