import { mood } from '../../audio/player/music'
import { sound } from '../../audio/player/sound'
import { fall, save, wipe } from '../../core/save/save'
import { unlock } from '../../core/save/wild'
import { PREY } from '../../data/enemies/enemies'
import { front } from '../../ui/front/front'
import { intro } from '../../ui/front/intro'
import { hud } from '../../ui/hud/hud'
import { settings } from '../../ui/settings/settings'
import { where } from '../place/place'
import { tools } from './dev'
import { ask, card, evos, herald, self } from './notices'
import { restart, run } from './run'
import { G } from './state'

const enter = () => {
  G.fade = 0
  G.frozen = false
  save.started = true
}
const begin = () => {
  enter()
  mood(true)
}
export const story = intro(() => {
  enter()
  G.start = 0
}, () => mood(true))
export const title = front(() => {
  if (save.started) herald(begin, true)
  else story.begin()
}, () => opts.open(false))
const leave = () => {
  fall(false)
  restart()
  G.fade = 1
  run.paused = false
  G.frozen = true
  mood(false)
}
export const opts = settings(leave, () => {
  wipe()
  restart()
  G.fade = 1
  G.frozen = run.paused = false
})
export const layers = [ask, evos, card, self, opts], top = () => layers.find(l => l.shown())
const flee = () => run.sim.away || (sound('feast'), run.sim.feast())
const FIRST = 'You can enhance your Dragonfly at the Lair with blood points, but it will reset the run. Continue?'
export const ui = hud(() => {
  run.paused = !run.paused
}, () => opts.open(true), () => save.fed || run.sim.away ? flee() : ask.open([FIRST], [["Let's go!", flee], ["I'll stay a bit longer", () => {}]]), () => {
  const w = run.sim.away ? undefined : unlock()
  if (w?.kind && PREY[w.kind].stage === where.stage) run.sim.prey.join(w.kind)
  else if (w && !w.kind) flee(), run.sim.onward = true
}, tools)
