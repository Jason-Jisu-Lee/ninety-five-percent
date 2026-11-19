import { own, save } from '../../core/save/save'
import type { Tool } from '../../ui/dev/console'
import { evos } from './notices'
import { run } from './run'

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
  [() => 'Blood shop', () => evos.open(0)],
  [() => 'Evo shop', () => evos.open(1)],
  [() => 'Die', () => run.sim.die()],
] : []

if (import.meta.env.DEV) Object.assign(globalThis, { peek: () => run.sim })
