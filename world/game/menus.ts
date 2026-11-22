import { mood } from '../../audio/player/music'
import { fall, save, wipe } from '../../core/save/save'
import { front } from '../../ui/front/front'
import { intro } from '../../ui/front/intro'
import { hud } from '../../ui/hud/hud'
import { settings } from '../../ui/settings/settings'
import { settle } from '../place/place'
import { tools } from './dev'
import { ask, card, evos, self } from './notices'
import { restart, run } from './run'
import { G } from './state'

const begin = () => {
  G.going = true
  mood(true)
}
export const story = intro(begin)
export const title = front(() => {
  if (save.started) begin()
  else story.begin()
}, () => opts.open(false))
const leave = () => {
  fall(false)
  restart()
  G.fade = 1
  G.going = run.paused = false
  G.frozen = true
  mood(false)
}
export const opts = settings(() => ask.open(['This will forfeit your current run and you will lose 95% of current blood points. Continue?'], [['Continue', leave], ['Cancel', () => {}]]), () => {
  wipe()
  settle()
  restart()
  G.fade = 1
  G.going = G.frozen = run.paused = false
})
export const layers = [ask, evos, card, self, opts], top = () => layers.find(l => l.shown())
export const ui = hud(() => {
  run.paused = !run.paused
}, () => opts.open(true), () => run.sim.feast(), tools)
