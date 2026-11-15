import { dither } from '../core/draw/dither'
import type { Ctx } from '../core/screen/canvas'
import { FOREST as C, UI } from '../data/look/palette'
import { box } from '../ui/parts/panel'
import { chip } from './chip'
import type { Sound } from './hear'

const WIDE = 31, TALL = 11, LIFE = 1.4, REACH = 21, rings: number[] = []
let wait = 0, quiet = 0

export function pond(g: Ctx, right: number, name: string, s: Sound, dt: number) {
  const x = chip(g, right, name, WIDE), cx = x + 15, cy = 16
  wait -= dt
  if ((quiet += dt) > 1.6 || wait < 0 && s.hit > .3) {
    rings.push(0)
    wait = .3
    quiet = 0
  }
  for (let i = rings.length; i--;) if ((rings[i] += dt / LIFE) >= 1) rings.splice(i, 1)
  box(g, x, 11, WIDE, TALL, C.w3, C.w2)
  for (let py = 12; py < 10 + TALL; py++) for (let px = x + 1; px < x + WIDE - 1; px++) {
    const far = Math.hypot(px - cx, (py - cy) * 1.7)
    for (const age of rings) if (Math.abs(far - 1 - age * REACH) < .6 && dither(px, py, 2.4 - age * 2.4)) {
      g.fillStyle = age < .12 ? UI.text : age < .5 ? C.glint : C.wSh
      g.fillRect(px, py, 1, 1)
    }
  }
}
