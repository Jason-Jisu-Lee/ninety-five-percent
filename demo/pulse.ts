import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { hits } from './hits'
import { line } from './line'

const N = 34, RATE = 30, TALL = 6, SHAPE = [-.2, .55, 1, -.5, -.2], past = new Float32Array(N), hit = hits(.3)
let due = 0, at = 9, size = 0

export function pulse(g: Ctx, right: number, cy: number, level: number[], dt: number) {
  const s = hit(level, dt)
  if (s) [at, size] = [0, s]
  for (due += dt * RATE; due >= 1; due--) {
    past.copyWithin(0, 1)
    past[N - 1] = (SHAPE[at++] ?? 0) * size
  }
  line(g, right - N, Array.from(past, v => cy + 2 - Math.round(v * TALL)), UI.accent)
}
