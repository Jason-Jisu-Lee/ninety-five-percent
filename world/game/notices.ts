import { hush } from '../../audio/player/music'
import { progress, save } from '../../core/save/save'
import { PREY } from '../../data/enemies/enemies'
import { enemyCard } from '../../ui/enemy/card'
import { flyCard } from '../../ui/fly/card'
import { dialog } from '../../ui/parts/dialog'
import { story } from '../../ui/parts/story'
import { shop } from '../../ui/shop/shop'
import type { Prey } from '../creatures/prey'
import { restart, run } from './run'
import { G } from './state'

const none = () => {}, LINES = ['Prepare to feed...'], LINE = [''], READ = 2.6
let after = none

export const ask = dialog(), card = enemyCard(), self = flyCard(), evos = shop()

export const omen = story([LINE], () => after(), 0, 0, READ)

export function herald(then: () => void) {
  const rest = LINES.filter(l => l !== LINE[0])
  LINE[0] = (rest.length ? rest : LINES)[Math.random() * (rest.length || LINES.length) | 0]
  after = then
  omen.begin()
}

export const fate = story([["You've lost 95% of blood points"]], () => {
  run.sim.away = true
  G.dusk = 1
  evos.open(0, () => herald(() => restart(true)))
}, 0, 0)

export function mourn() {
  hush(true)
  fate.begin()
}

export function attack(p: Prey | null) {
  if (!p || run.paused || run.sim.away) return
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
