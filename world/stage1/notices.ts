import { hush } from '../../audio/player/music'
import { evolve, progress, save } from '../../core/save/save'
import { PREY } from '../../data/enemies/enemies'
import { enemyCard } from '../../ui/enemy/card'
import { dialog } from '../../ui/parts/dialog'
import { story } from '../../ui/parts/story'
import { shop } from '../../ui/shop/shop'
import type { Prey } from '../creatures/prey'
import type { Perch } from './hunt/sim'
import { restart, run } from './run'

const TWICE = 350, none = () => {}
let tapped: Prey | null = null, tap = 0, prior: Prey | null = null, seat: Perch | null = null

export const ask = dialog(), card = enemyCard(), evos = shop()

export const rise = () => ask.open(['This will reset all in-game progress.'], [['Evolve', () => {
  evolve()
  restart()
  evos.open()
}], ['Cancel', none]])

export const fate = story([["You've lost half your blood points spent this run"]], () => hush(false), 0, 1.2)

export function mourn() {
  hush(true)
  fate.begin()
}

function attack(p: Prey) {
  if (!PREY[p.kind].power || save.warned) return run.sim.aim(p)
  ask.open(['There is less than 95% chance you will catch this enemy successfully.'], [['Attack', () => {
    save.warned = true
    run.sim.aim(p)
  }], ['Cancel', none]])
}

export function tapEnemy(p: Prey | null) {
  const { sim } = run, now = performance.now()
  if (p && p === tapped && now - tap < TWICE) {
    sim.aim(prior)
    if (!prior) sim.rest = seat
    if (sim.fly.perched) progress('look')
    card.open(p)
  } else if (p) {
    ;[prior, seat] = [sim.mark, sim.rest]
    if (!run.paused && sim.sel && !sim.fly.perched) attack(p)
  }
  ;[tapped, tap] = [p, now]
  return !!p
}
