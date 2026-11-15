import type { Pixels } from '../../../core/draw/pixels'
import { FOREST as C } from '../../../data/look/palette'
import { stroke } from '../../stage1/scenery/stroke'

const PETAL = [C.white, C.yellow, C.pink]

export function tuft(p: Pixels, x: number, y: number, R: () => number) {
  p.set(x, y, C.g0)
  p.set(x + 1, y, C.g0)
  for (let i = 0; i < 3; i++) {
    const k = i - 1 + (R() - .5) * .6
    stroke(p, x + k * 1.5, y, -1.571 + k * .9, 4 + R() * 3.5, k * 2, u => .9 - u * .5, s => s > .3 ? C.g0 : R() < .3 ? C.cLight : C.g2)
  }
}

export function bloom(p: Pixels, x: number, y: number, hue: number) {
  const col = PETAL[hue]
  for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) p.set(x + dx, y + dy, col)
  p.set(x, y, hue ? C.seed : C.yellow)
  p.set(x + 1, y + 2, C.g0)
}

export function reedlet(p: Pixels, x: number, y: number, R: () => number) {
  const len = 9 + R() * 5, lean = 1 + R() * 2
  stroke(p, x, y, Math.atan2(-len, lean), len, 1, u => u > .68 ? 1.1 : .55, (_s, u) => u > .68 ? C.t1 : C.g3)
}
