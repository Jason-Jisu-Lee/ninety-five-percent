import { back } from '../../core/loop'
import { once } from '../../core/once'
import type { Scene } from '../../core/scene'
import { DF } from '../../data/dragonfly'
import { flock } from '../dragonfly/flock'
import { canopy } from './canopy'
import { flight } from './flight'
import { flows } from './flows'
import { ground } from './ground'
import { prop } from './prop'
import { props } from './props'
import { wind } from './wind'

const sprites = once(() => flock('blue', true)), half = DF.S >> 1
let air: ReturnType<typeof wind>, fly: ReturnType<typeof flight>

export const forest: Scene = {
  enter() {
    air = wind()
    fly = flight()
  },
  update(dt, t) {
    air.step(t)
    fly.step(dt, t)
  },
  draw(g, _, t) {
    const { spr, sh } = sprites(), fr = fly.state === 'glide' ? DF.flapFrames : Math.floor(fly.flap) % DF.flapFrames
    g.drawImage(ground().canvas, 0, 0)
    flows(g, t)
    for (const p of props()) prop(g, p, air.lean(p.x, p.y, p.j, t))
    g.drawImage(sh[fly.heading][fr], Math.round(fly.x + fly.h * .45) - half, Math.round(fly.y + 1) - half)
    g.drawImage(canopy(), 0, 0)
    g.drawImage(spr[fly.heading][fr], Math.round(fly.x) - half, Math.round(fly.y - fly.h * .7) - half)
  },
  key: back,
}
