import { rng } from '../../core/math/rng'
import { PREY, type Kind } from '../../data/enemies/enemies'
import { FIGHT } from '../../data/dragonfly/fight'

const memo = new Map<string, number>()

export function odds(kind: Kind, power: number, health: number) {
  const k = PREY[kind], key = kind + power + '/' + health, [lo, hi] = FIGHT.jitter
  if (!k.power) return 1
  if (memo.has(key)) return memo.get(key)!
  const R = rng(95), kill = Math.ceil(k.hp / power) * FIGHT.bite, blows = Math.ceil(health / k.power)
  let wins = 0
  for (let i = 0; i < FIGHT.trials; i++) {
    let t = 0
    for (let n = 0; n < blows; n++) t += k.strike * (lo + R() * (hi - lo))
    if (t >= kill) wins++
  }
  memo.set(key, wins / FIGHT.trials)
  return wins / FIGHT.trials
}
