import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { chip } from './chip'
import type { Sound } from './hear'

const ORDER = [6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6], half = Array<number>(7).fill(0)

export function lens(g: Ctx, right: number, name: string, s: Sound, dt: number) {
  const x = chip(g, right, name, ORDER.length * 2 - 1)
  for (let k = 0; k < 7; k++) {
    const want = Math.max(0, (s.bands[k] - .3) / .7) * (5 - k * .35)
    half[k] = want > half[k] ? want : Math.max(want, half[k] - dt * 26)
  }
  g.fillStyle = UI.accent
  ORDER.forEach((k, i) => g.fillRect(x + i * 2, 16 - Math.round(half[k]), 1, 2 * Math.round(half[k]) + 1))
}
