import { toggle } from '../../audio/player/music'
import type { Scene } from '../../core/loop/scene'
import { save, store, wipe } from '../../core/save/save'
import { FADE } from '../../data/stage1/map'
import { front } from '../../ui/front/front'
import { intro } from '../../ui/front/intro'
import { hud } from '../../ui/hud/hud'
import { settings } from '../../ui/settings/settings'
import type { Prey } from '../creatures/prey'
import { tools } from './dev'
import type { Perch } from './hunt/sim'
import { ask, card, evos, mourn, rise, tapEnemy } from './notices'
import { render } from './render'
import { restart, run } from './run'

let fade = 1, going = false, frozen = false, clock = 0, kept = 0, aim: Perch | null = null, hot: Prey | null = null

const story = intro(() => {
  going = true
})
const title = front(() => {
  if (save.started) going = true
  else story.begin()
}, () => opts.open(false))
const opts = settings(() => {
  fade = 1
  going = run.paused = false
  frozen = true
  store()
}, () => {
  wipe()
  restart()
  fade = 1
  going = frozen = run.paused = false
})
const layers = [ask, evos, card, opts], top = () => layers.find(l => l.shown())
const ui = hud(() => {
  run.paused = !run.paused
}, () => opts.open(true), rise, tools)

export const stage1: Scene = {
  enter: restart,
  update(dt) {
    const { sim } = run
    story.update(dt)
    if (going && fade > 0 && (fade -= dt / FADE) <= 0) [frozen, save.started] = [false, true]
    if (fade > 0) return void (frozen || sim.idle(dt, clock += dt))
    if (run.paused || top()) return
    for (let i = 0; i < run.rate; i++) sim.step(dt, clock += dt)
    if (sim.refund >= 0) mourn(sim.refund)
    sim.refund = -1
    save.time += dt * run.rate
    if (sim.sel) save.hand += dt * run.rate
    if ((kept += dt) < 5) return
    kept = 0
    store()
  },
  draw(g) {
    render(g, run.sim, clock, fade <= 0, aim, hot)
    if (fade > 0) title.draw(g, fade)
    else ui.draw(g, run.sim.sel, run.paused)
    story.draw(g)
    for (let i = layers.length; i--;) layers[i].draw(g)
  },
  hover(x, y) {
    const { sim } = run
    if (story.on()) return false
    if (top()) return top()!.hover(x, y)
    if (fade > 0) return !going && title.hover(x, y)
    sim.cursor = [x, y]
    aim = hot = null
    if (ui.hover(x, y)) return true
    hot = sim.prey.at(x, y)
    aim = sim.sel && !hot && !run.paused ? sim.perchAt(x, y) : null
    return !!hot || !!aim || !run.paused && sim.onFly(x, y) && sim.free()
  },
  click(x, y) {
    if (story.on()) return story.next()
    if (top()) return top()!.click(x, y)
    if (fade > 0) return void (going || title.click(x, y))
    if (!ui.click(x, y) && !tapEnemy(run.sim.prey.at(x, y)) && !run.paused) run.sim.click(x, y)
  },
  key(k) {
    if (story.on()) return k === 'Escape' ? story.skip() : story.next(), true
    if (top()) return top()!.key(k)
    if (fade > 0) return !going && title.key(k)
    if (k === 'Escape') opts.open(true)
    else if (k === 'p' || k === ' ') run.paused = !run.paused
    else if (k === 'm') toggle()
    else if (k === 'u') ui.flip()
    else return false
    return true
  },
}
