import { mood } from '../../audio/player/music'
import { sound } from '../../audio/player/sound'
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
export const opts = settings(leave, () => {
  wipe()
  settle()
  restart()
  G.fade = 1
  G.going = G.frozen = run.paused = false
})
export const layers = [ask, evos, card, self, opts], top = () => layers.find(l => l.shown())
export const ui = hud(() => {
  run.paused = !run.paused
}, () => opts.open(true), () => run.sim.away || (sound('feast'), run.sim.feast()), tools)
