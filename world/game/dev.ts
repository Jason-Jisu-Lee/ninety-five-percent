import { adopt, own, save } from '../../core/save/save'
import { pack } from '../../core/save/wild'
import { view } from '../../core/screen/display'
import type { Tool } from '../../ui/dev/console'
import { PLACES } from '../../data/game/map'
import { settle, where } from '../place/place'
import { evos } from './notices'
import { restart, run } from './run'

const SLOT = 'ninety-five-percent-dev', said = { word: '', until: 0 }
const say = (word: string) => Object.assign(said, { word, until: performance.now() + 900 })
const label = (name: string, words: string[]) => () => performance.now() < said.until && words.includes(said.word) ? said.word : name

export const tools: Tool[] = import.meta.env.DEV ? [
  [() => 'x' + run.rate, () => {
    run.rate = run.rate % 8 * 2 || 1
  }],
  [() => '+500', () => {
    save.blood += 500
  }],
  [() => '+50k', () => {
    save.blood += 50000
  }],
  [() => '+5k EP', () => {
    save.points += 5000
  }],
  [() => 'Refill', () => Object.assign(run.sim, { stamina: 100, health: own('health') })],
  [() => 'Shop', () => evos.open(0)],
  [() => 'Evo', () => evos.open(1)],
  [() => 'Die', () => run.sim.die()],
  [() => PLACES[where.stage - 1], () => {
    where.stage = where.stage % PLACES.length + 1
    restart(false, true)
  }],
  [view.name, view.next],
  [label('Save', ['Saved']), () => {
    localStorage.setItem(SLOT, JSON.stringify({ ...save, got: pack.got }))
    say('Saved')
  }],
  [label('Load', ['Loaded', 'Empty']), () => {
    const { got = 0, ...kept } = JSON.parse(localStorage.getItem(SLOT) ?? '{}')
    if (!kept.started) return void say('Empty')
    adopt(kept)
    pack.got = got
    settle()
    restart(false, true)
    say('Loaded')
  }],
] : []

if (import.meta.env.DEV) Object.assign(globalThis, { peek: () => run.sim })
