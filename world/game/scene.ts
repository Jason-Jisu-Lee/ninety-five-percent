import { mood, toggle } from '../../audio/player/music'
import { sound } from '../../audio/player/sound'
import { shade, veil } from '../../core/draw/dissolve'
import type { Scene } from '../../core/loop/scene'
import { save, store, wipe } from '../../core/save/save'
import { LUNGE, STREAK } from '../../data/dragonfly/fight'
import { FLY } from '../../data/dragonfly/flight'
import { DUSK, FADE } from '../../data/game/map'
import { front } from '../../ui/front/front'
import { intro } from '../../ui/front/intro'
import { hud } from '../../ui/hud/hud'
import { settings } from '../../ui/settings/settings'
import { glow, tick } from '../../ui/track/track'
import type { Prey } from '../creatures/prey'
import { tools } from './dev'
import { renew } from '../place/place'
import { ask, attack, card, evos, fate, inspect, mourn, self } from './notices'
import { render } from './render'
import { restart, run } from './run'

let fade = 1, dusk = 0, going = false, frozen = false, clock = 0, kept = 0, halt = 0, hot: Prey | null = null

const begin = () => {
  going = true
  mood(true)
}
const story = intro(begin)
const title = front(() => {
  if (save.started) begin()
  else story.begin()
}, () => opts.open(false))
const opts = settings(() => {
  fade = 1
  going = run.paused = false
  frozen = true
  mood(false)
  store()
}, () => {
  wipe()
  restart()
  fade = 1
  going = frozen = run.paused = false
})
const layers = [ask, evos, card, self, opts], onFly = (x: number, y: number) => Math.hypot(x - run.sim.fly.x, y - run.sim.fly.y + run.sim.fly.h * .7) < 13, top = () => layers.find(l => l.shown())
const ui = hud(() => {
  run.paused = !run.paused
}, () => opts.open(true), () => run.sim.feast(), tools)

export const stage1: Scene = {
  enter: restart,
  update(dt) {
    tick(dt)
    story.update(dt)
    fate.update(dt)
    const { sim } = run
    if (going && fade > 0 && (fade -= dt / FADE) <= 0) [frozen, save.started] = [false, true]
    if (fade > 0) return void (frozen || sim.idle(dt, clock += dt))
    if (fate.on()) return sim.idle(dt, clock += dt)
    if (run.paused || top() || (halt -= dt) > 0) return
    for (let i = 0; i < run.rate; i++) sim.step(dt, clock += dt)
    if (sim.jolt) [sim.jolt, halt] = [false, LUNGE.freeze], sound('thump')
    if (sim.fell) mourn()
    sim.fell = false
    if (!sim.away || sim.fly.x > -FLY.gone) dusk = Math.max(0, dusk - dt / DUSK)
    else if ((dusk += dt / DUSK) >= 1) renew(), evos.open(0, () => restart(true))
    save.time += dt * run.rate
    if ((kept += dt) < 5) return
    kept = 0
    store()
  },
  draw(g) {
    render(g, run.sim, clock, fade <= 0, top() ? null : hot)
    if (fade > 0) title.draw(g, fade)
    else {
      ui.draw(g, run.paused, run.sim.chain, 1 - run.sim.since / STREAK.time)
      if (dusk > 0) veil(g, Math.min(1, dusk))
    }
    story.draw(g)
    for (let i = layers.length; i--;) layers[i].draw(g)
    fate.draw(g)
  },
  over(g, k) {
    const dark = shade.n
    shade.n = 0
    if (fade > 0) title.over(g, k, fade, dark)
    glow(g, k, evos.shown() ? 0 : fade > 0 ? fade : 1, dark)
  },
  hover(x, y) {
    const was = hot
    if (story.on() || fate.on()) return false
    if (top()) return top()!.hover(x, y)
    if (fade > 0) return !going && title.hover(x, y)
    hot = null
    if (ui.hover(x, y)) return true
    hot = run.sim.prey.at(x, y, was)
    return !!hot || onFly(x, y)
  },
  click(x, y) {
    if (story.on()) return story.next()
    if (fate.on()) return
    if (top()) return top()!.click(x, y)
    if (fade > 0) return void (going || title.click(x, y))
    if (ui.click(x, y) || inspect(run.sim.prey.at(x, y, hot))) return
    if (onFly(x, y)) self.open()
    else if (!run.paused) run.sim.mark = null
  },
  key(k) {
    if (story.on()) return k === 'Escape' ? story.skip() : story.next(), true
    if (fate.on()) return true
    if (top()) return top()!.key(k)
    if (k === 'm') return toggle(), true
    if (fade > 0) return !going && title.key(k)
    if (k === 'a') return hot && hot !== run.sim.mark ? attack(hot) : run.sim.dart(), false
    if (k === 'Escape') opts.open(true)
    else if (k === 'p' || k === ' ') run.paused = !run.paused
    else return false
    return true
  },
}
