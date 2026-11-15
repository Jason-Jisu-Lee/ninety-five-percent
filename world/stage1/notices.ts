import { evolve, save } from '../../core/save/save'
import { PREY } from '../../data/enemies/enemies'
import { enemyCard } from '../../ui/enemy/card'
import { dialog } from '../../ui/parts/dialog'
import { shop } from '../../ui/shop/shop'
import type { Prey } from '../creatures/prey'
import { restart, run } from './run'

const TWICE = 350, none = () => {}
let tapped: Prey | null = null, tap = 0, prior: Prey | null = null

export const ask = dialog(), card = enemyCard(), evos = shop()

export const rise = () => ask.open(['This will reset all in-game progress.'], [['Evolve', () => {
  evolve()
  restart()
  evos.open()
}], ['Cancel', none]])

export const mourn = (refund: number) => ask.open(['The dragonfly died.', 'It revives without its upgrades.', `Blood refunded: ${refund}`], [['Continue', none]])

function attack(p: Prey) {
  if (!PREY[p.kind].power || save.warned) return run.sim.aim(p)
  ask.open(['This enemy fights back.', 'If the dragonfly dies, it revives without its upgrades.', 'Half of the blood spent on them is refunded.'], [['Attack', () => {
    save.warned = true
    run.sim.aim(p)
  }], ['Cancel', none]])
}

export function tapEnemy(p: Prey | null) {
  const { sim } = run, now = performance.now()
  if (p && p === tapped && now - tap < TWICE) {
    sim.aim(prior)
    card.open(p)
  } else if (p) {
    prior = sim.mark
    if (!run.paused && sim.sel) attack(p)
  }
  ;[tapped, tap] = [p, now]
  return !!p
}
