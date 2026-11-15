import { toggle } from '../../audio/player/music'
import type { Scene } from '../../core/loop/scene'
import { save, store, wipe } from '../../core/save/save'
import { FADE } from '../../data/stage1/map'
import { signKey } from '../../demo/sign'
import { front } from '../../ui/front/front'
import { intro } from '../../ui/front/intro'
import { hud } from '../../ui/hud/hud'
import { settings } from '../../ui/settings/settings'
import { hunt } from './hunt/hunt'
import type { Perch } from './hunt/sim'
import { render } from './render'

let sim: ReturnType<typeof hunt>, fade = 1, going = false, frozen = false, paused = false, clock = 0, kept = 0, aim: Perch | null = null

const story = intro(() => {
  going = true
})
const title = front(() => {
  if (save.started) going = true
  else story.begin()
}, () => opts.open(false))
const opts = settings(() => {
  fade = 1
  going = paused = false
  frozen = true
  store()
}, () => {
  wipe()
  sim = hunt()
  fade = 1
  going = frozen = paused = false
})
const ui = hud(() => {
  paused = !paused
}, () => opts.open(true))

export const stage1: Scene = {
  enter() {
    sim = hunt()
  },
  update(dt) {
    story.update(dt)
    if (going && fade > 0 && (fade -= dt / FADE) <= 0) [frozen, save.started] = [false, true]
    if (fade > 0) return void (frozen || sim.idle(dt, clock += dt))
    if (paused || opts.shown()) return
    sim.step(dt, clock += dt)
    save.time += dt
    if (sim.sel) save.hand += dt
    if ((kept += dt) < 5) return
    kept = 0
    store()
  },
  draw(g) {
    render(g, sim, clock, fade <= 0, aim)
    if (fade > 0) title.draw(g, fade)
    else ui.draw(g, sim.sel, paused)
    story.draw(g)
    opts.draw(g)
  },
  hover(x, y) {
    if (story.on()) return false
    if (opts.shown()) return opts.hover(x, y)
    if (fade > 0) return !going && title.hover(x, y)
    sim.cursor = [x, y]
    aim = null
    if (ui.hover(x, y)) return true
    if (paused) return false
    aim = sim.sel ? sim.perchAt(x, y) : null
    return !!aim || sim.onFly(x, y) && sim.free()
  },
  click(x, y) {
    if (story.on()) return story.next()
    if (opts.shown()) return opts.click(x, y)
    if (fade > 0) return void (going || title.click(x, y))
    if (!ui.click(x, y) && !paused) sim.click(x, y)
  },
  key(k) {
    if (story.on()) return k === 'Escape' ? story.skip() : story.next(), true
    if (opts.shown()) return opts.key(k)
    if (fade > 0) return !going && title.key(k)
    if (k === 'Escape') opts.open(true)
    else if (k === 'p' || k === ' ') paused = !paused
    else if (k === 'm') toggle()
    else if (k === 'u') ui.flip()
    else return signKey(k)
    return true
  },
}
