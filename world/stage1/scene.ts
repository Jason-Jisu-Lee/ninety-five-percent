import { dissolve } from '../../core/dissolve'
import { once } from '../../core/once'
import type { Scene } from '../../core/scene'
import { DF } from '../../data/dragonfly'
import { UI } from '../../data/palette'
import { POST, PREY } from '../../data/prey'
import { FADE, GIANT } from '../../data/stage1'
import { energy } from '../../ui/energy'
import { front } from '../../ui/front'
import { healthBar } from '../../ui/health_bar'
import { reticle } from '../../ui/reticle'
import { ring } from '../../ui/ring'
import { sheet } from '../dragonfly/sheet'
import { drawPrey } from '../prey/draw'
import { glints } from './glints'
import { ground } from './ground'
import { hunt, type Control } from './hunt'

const me = once(() => sheet('blue')), giant = once(() => sheet('blue', DF.scale * GIANT)), title = front(() => { going = true })
let sim: ReturnType<typeof hunt>, fade = 1, going = false, control: Control = 1

export function show(c: Control) {
  going = false
  fade = c ? 0 : 1
  if (c) control = c
  else sim = hunt()
  sim.control = c
}

export const stage1: Scene = {
  enter() {
    sim = hunt()
  },
  update(dt, t) {
    if (going && fade > 0 && (fade -= dt / FADE) <= 0) sim.control = control
    sim.step(dt, t)
  },
  draw(g, t) {
    const { fly, prey, fx, held, mark } = sim, frame = Math.floor(fly.flap) % DF.flapFrames, [spr, sh] = me()(fly.heading, frame, !!held)
    const half = spr.width >> 1, sx = Math.round(fly.x + fly.h * .45), sy = Math.round(fly.y)
    g.drawImage(ground(), 0, 0)
    glints(g, t)
    if (sim.control === 3) ring(g, sim.post.x, sim.post.y, POST.r, UI.text)
    fx.litter(g)
    for (const p of prey.list) drawPrey(g, p, t, true)
    if (fade > 0) {
      const big = giant()(0, frame)[1]
      dissolve(g, big, sx - (big.width >> 1), sy - (big.height >> 1), fade / 2)
    }
    g.drawImage(sh, sx - half, sy - half)
    for (const p of prey.list) drawPrey(g, p, t)
    g.drawImage(spr, Math.round(fly.x) - half, Math.round(fly.y - fly.h * .7) - half)
    fx.numbers(g)
    if (held) healthBar(g, Math.round(held.x), Math.round(held.y - held.h * .7) + (Math.sin(fly.ang) > .35 ? 7 : -9), held.hp / PREY[held.kind].hp)
    if (mark && mark !== held) reticle(g, Math.round(mark.x), Math.round(mark.y - mark.h * .7), 7, UI.text)
    if (fade > 0) title.draw(g, fade)
    else energy(g, sim.energy)
  },
  hover(x, y) {
    sim.cursor = [x, y]
    return fade > 0 ? !going && title.hover(x, y) : sim.control === 2 && !!sim.pick(x, y)
  },
  click(x, y) {
    if (fade > 0) return void (going || title.click(x, y))
    if (sim.control === 2) sim.mark = sim.pick(x, y) ?? sim.mark
    if (sim.control === 3) sim.post = { x, y }
  },
  key(k) {
    if (fade > 0) return !going && title.key(k)
    if (k === 'Escape') show(0)
    return k === 'Escape'
  },
}
