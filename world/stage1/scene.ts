import { toggle } from '../../audio/music'
import { dissolve } from '../../core/dissolve'
import { outline } from '../../core/outline'
import { save, store, wipe } from '../../core/save'
import type { Scene } from '../../core/scene'
import { DF, STAMINA } from '../../data/dragonfly'
import { FOREST as C, UI } from '../../data/palette'
import { PREY } from '../../data/stage1/enemies'
import { stage } from '../../data/stats'
import { FADE } from '../../data/stage1/scene'
import { bar } from '../../ui/bar'
import { front } from '../../ui/front'
import { hud } from '../../ui/hud'
import { intro } from '../../ui/intro'
import { ring } from '../../ui/ring'
import { settings } from '../../ui/settings'
import { wear } from '../dragonfly/sheet'
import { drawPrey } from '../creatures/draw'
import { glints } from './glints'
import { ground } from './ground'
import { hunt, type Perch } from './hunt'

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
    const { fly, prey, fx, held } = sim, st = [stage(save.lv.speed), stage(save.lv.power)], [spr, sh] = wear(DF.color, st)(fly.heading, fly.frame, !!held)
    const half = spr.width >> 1, sx = Math.round(fly.x + fly.h * .45), sy = Math.round(fly.y), x = Math.round(fly.x), y = Math.round(fly.y - fly.h * .7)
    g.drawImage(ground(), 0, 0)
    glints(g, clock)
    fx.litter(g)
    for (const p of prey.list) drawPrey(g, p, clock, true)
    if (fade > 0) {
      const big = wear(DF.color, st, DF.giant)(0, fly.frame)[1]
      dissolve(g, big, sx - (big.width >> 1), sy - (big.height >> 1), fade / 2)
    }
    g.drawImage(sh, sx - half, sy - half)
    for (const p of prey.list) drawPrey(g, p, clock)
    if (aim && fade <= 0) ring(g, aim.x, Math.round(aim.y - aim.h * .7), 7, UI.text)
    if (sim.sel && sim.glow > 0) outline(g, spr, x - half, y - half, C.yellow)
    g.drawImage(spr, x - half, y - half)
    if (held) {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) drawPrey(g, { ...held, x: held.x + dx, y: held.y + dy }, clock, false, C.red)
      drawPrey(g, held, clock)
    }
    fx.numbers(g)
    if (held) bar(g, Math.round(held.x), Math.round(held.y - held.h * .7) + (Math.sin(fly.ang) > .35 ? 7 : -9), Math.max(0, held.hp) / PREY[held.kind].hp, Math.min(40, 10 + 2 * PREY[held.kind].hp))
    if (fade > 0) title.draw(g, fade)
    else {
      if (sim.sel || sim.glow > 0 || sim.stamina < (fly.perched ? 99 : STAMINA.show)) bar(g, x, y - 25, sim.stamina / 100, 20, sim.stamina < STAMINA.tired ? C.pink : UI.accent, fly.perched && sim.stamina < STAMINA.wake ? STAMINA.wake / 100 : 0)
      ui.draw(g, sim.sel, paused)
    }
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
    else return false
    return true
  },
}
