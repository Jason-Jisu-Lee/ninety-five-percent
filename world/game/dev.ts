import { own, save } from '../../core/save/save'
import { view } from '../../core/screen/display'
import type { Tool } from '../../ui/dev/console'
import { PLACES, where } from '../place/place'
import { evos } from './notices'
import { restart, run } from './run'

export const tools: Tool[] = import.meta.env.DEV ? [
  [() => 'x' + run.rate, () => {
    run.rate = run.rate % 8 * 2 || 1
  }],
  [() => '+500', () => {
    save.blood += 500
  }],
  [() => '+5 EP', () => {
    save.points += 5
  }],
  [() => 'Refill', () => Object.assign(run.sim, { stamina: 100, health: own('health') })],
  [() => 'Shop', () => evos.open(0)],
  [() => 'Evo', () => evos.open(1)],
  [() => 'Die', () => run.sim.die()],
  [() => PLACES[where.stage - 1], () => {
    where.stage = where.stage % PLACES.length + 1
    restart()
  }],
  [view.name, view.next],
] : []

if (import.meta.env.DEV) Object.assign(globalThis, { peek: () => run.sim })
