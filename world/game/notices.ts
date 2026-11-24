import { hush } from '../../audio/player/music'
import { progress, save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
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

const calls = [0, .6].map(edge => story([LINE], () => after(), edge, edge, READ))
export const omen = { on: () => calls.some(c => c.on()), next: () => calls.forEach(c => c.next()), update: (dt: number) => calls.forEach(c => c.update(dt)), draw: (g: Ctx) => calls.forEach(c => c.draw(g)) }

export function herald(then: () => void, soft = false) {
  const rest = LINES.filter(l => l !== LINE[0])
  LINE[0] = (rest.length ? rest : LINES)[Math.random() * (rest.length || LINES.length) | 0]
  after = then
  calls[+soft].begin()
}

export const fate = story([["You've lost 95% of blood points"]], () => {
  run.sim.away = true
  G.dusk = 1
  evos.open(0, () => herald(() => restart(true)))
}, 0, 0, 4.4)

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
  if (p.kind === 'fruitfly') progress('look')
  card.open(p)
  return true
}
