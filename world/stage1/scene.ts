import { toggle } from '../../audio/music'
import { dissolve } from '../../core/dissolve'
import { once } from '../../core/once'
import { outline } from '../../core/outline'
import { save, store, wipe } from '../../core/save'
import type { Scene } from '../../core/scene'
import { DF, STAMINA } from '../../data/dragonfly'
import { FOREST as C, UI } from '../../data/palette'
import { PREY } from '../../data/prey'
import { FADE, GIANT } from '../../data/stage1'
import { bar } from '../../ui/bar'
import { front } from '../../ui/front'
import { hud } from '../../ui/hud'
import { ring } from '../../ui/ring'
import { settings } from '../../ui/settings'
import { sheet } from '../dragonfly/sheet'
import { drawPrey } from '../prey/draw'
import { glints } from './glints'
import { ground } from './ground'
import { hunt, type Perch } from './hunt'

const me = once(() => sheet('blue')), giant = once(() => sheet('blue', DF.scale * GIANT))
let sim: ReturnType<typeof hunt>, fade = 1, going = false, frozen = false, paused = false, clock = 0, kept = 0, aim: Perch | null = null

const title = front(() => {
  going = true
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
    if (going && fade > 0 && (fade -= dt / FADE) <= 0) [frozen, save.started] = [false, true]
    if (fade > 0) return void (frozen || sim.idle(dt, clock += dt))
    if (paused || opts.shown()) return
    sim.step(dt, clock += dt)
    if ((kept += dt) < 5) return
    kept = 0
    store()
  },
  draw(g) {
    const { fly, prey, fx, held } = sim, frame = fly.perched ? DF.flapFrames : Math.floor(fly.flap) % DF.flapFrames, [spr, sh] = me()(fly.heading, frame, !!held)
    const half = spr.width >> 1, sx = Math.round(fly.x + fly.h * .45), sy = Math.round(fly.y), x = Math.round(fly.x), y = Math.round(fly.y - fly.h * .7)
    g.drawImage(ground(), 0, 0)
    glints(g, clock)
    fx.litter(g)
    for (const p of prey.list) drawPrey(g, p, clock, true)
    if (fade > 0) {
      const big = giant()(0, frame)[1]
      dissolve(g, big, sx - (big.width >> 1), sy - (big.height >> 1), fade / 2)
    }
    g.drawImage(sh, sx - half, sy - half)
    for (const p of prey.list) drawPrey(g, p, clock)
    if (aim && fade <= 0) ring(g, aim.x, Math.round(aim.y - aim.h * .7), 9, UI.text)
    if (sim.glow > 0) outline(g, spr, x - half, y - half, C.yellow)
    g.drawImage(spr, x - half, y - half)
    fx.numbers(g)
    if (held) bar(g, Math.round(held.x), Math.round(held.y - held.h * .7) + (Math.sin(fly.ang) > .35 ? 7 : -9), Math.max(0, held.hp) / PREY[held.kind].hp, Math.min(40, 10 + 2 * PREY[held.kind].hp))
    if (fade > 0) title.draw(g, fade)
    else {
      if (sim.sel || fly.perched || sim.stamina < STAMINA.show) bar(g, x, y - 29, sim.stamina / 100, 22, sim.stamina < STAMINA.tired ? C.pink : UI.accent, fly.perched ? STAMINA.wake / 100 : 0)
      ui.draw(g, sim.sel, paused)
    }
    opts.draw(g)
  },
  hover(x, y) {
    if (opts.shown()) return opts.hover(x, y)
    if (fade > 0) return !going && title.hover(x, y)
    sim.cursor = [x, y]
    aim = null
    if (ui.hover(x, y)) return true
    if (paused) return false
    aim = sim.sel ? sim.perchAt(x, y) : null
    return !!aim || sim.onFly(x, y) && (sim.sel || !sim.rest)
  },
  click(x, y) {
    if (opts.shown()) return opts.click(x, y)
    if (fade > 0) return void (going || title.click(x, y))
    if (!ui.click(x, y) && !paused) sim.click(x, y)
  },
  key(k) {
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
