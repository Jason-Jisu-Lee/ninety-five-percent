import type { Pixels } from '../../core/draw/pixels'
import { FOREST as C } from '../../data/look/palette'
import { shade } from '../stage1/scenery/shade'
import { stroke } from '../stage1/scenery/stroke'

export function fern(p: Pixels, x: number, y: number, R: () => number, k: number) {
  shade(p, x + 4 * k, y + 3 * k, 13 * k, 7 * k)
  for (let i = 0, n = 6 + (R() * 3 | 0); i < n; i++) {
    const a = (i + R() * .7) / n * 6.283, len = (15 + R() * 9) * k * (.8 - .2 * Math.sin(a))
    stroke(p, x, y, a, len, (R() - .5) * len * .5, u => .5 + 3 * k * (1 - u) ** .8 * (.55 + .45 * Math.abs(Math.sin(u * len * 1.1))), (s, u) => Math.abs(s) < .22 ? C.cDark : u * len % 3 < 1.4 ? C.cMid : C.cLight)
  }
}
