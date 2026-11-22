import { hush } from '../../audio/player/music'
import { progress, save } from '../../core/save/save'
import { PREY } from '../../data/enemies/enemies'
import { enemyCard } from '../../ui/enemy/card'
import { dialog } from '../../ui/parts/dialog'
import { story } from '../../ui/parts/story'
import { shop } from '../../ui/shop/shop'
import type { Prey } from '../creatures/prey'
import { restart, run } from './run'

const none = () => {}

export const ask = dialog(), card = enemyCard(), evos = shop()

export const fate = story([["You've lost 95% of blood points"]], () => {
  hush(false)
  restart()
}, 0, 1.2)

export function mourn() {
  hush(true)
  fate.begin()
}

export function attack(p: Prey | null) {
  if (!p || run.paused || run.sim.rest || run.sim.away) return
  if (!PREY[p.kind].power || save.warned) return void (run.sim.mark = p)
  ask.open(['There is less than 95% chance you will catch this enemy successfully.'], [['Attack', () => {
    save.warned = true
    run.sim.mark = p
  }], ['Cancel', none]])
}

export function inspect(p: Prey | null) {
  if (!p) return false
  if (run.sim.fly.perched) progress('look')
  card.open(p)
  return true
}
