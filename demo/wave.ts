import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { line } from './line'

const N = 34
let amp = 0, ph = 0

export function wave(g: Ctx, right: number, cy: number, level: number[], dt: number) {
  const loud = (level[0] + level[1] * 2 + level[2]) / 4
  amp += (loud - amp) * Math.min(1, dt * (loud > amp ? 30 : 5))
  ph += dt * 9
  line(g, right - N, Array.from({ length: N }, (_, i) => cy + Math.round((1 + amp * 6) * Math.sin(Math.PI * i / (N - 1)) ** 2 * Math.sin(i * .55 - ph))), UI.accent)
}
