import type { Ctx } from '../core/screen/canvas'
import { FOREST as C, UI } from '../data/look/palette'
import { chip } from './chip'
import type { Sound } from './hear'

const N = 35, RATE = 30, SHAPE = [-.2, .6, 1, -.5, -.2], past = new Float32Array(N)
let due = 0, at = 9, size = 0

export function pulse(g: Ctx, right: number, name: string, s: Sound, dt: number) {
  const x = chip(g, right, name, N)
  if (s.hit > .3 && at > 6) [at, size] = [0, .45 + s.hit * .55]
  for (due += dt * RATE; due >= 1; due--) {
    past.copyWithin(0, 1)
    past[N - 1] = (SHAPE[at++] ?? 0) * size
  }
  let was = 18 - Math.round(past[0] * 7)
  for (let i = 0; i < N; i++) {
    const y = 18 - Math.round(past[i] * 7), a = y > was ? Math.min(y, was + 1) : y, b = y < was ? Math.max(y, was - 1) : y
    g.fillStyle = i > N - 2 ? UI.text : i > N - 14 ? UI.accent : i > N - 26 ? C.g3 : C.g1
    g.fillRect(x + i, a, 1, b - a + 1)
    was = y
  }
}
