import type { Pixels } from '../../../core/draw/pixels'
import { FOREST as C } from '../../../data/look/palette'
import { Z as Z0 } from '../../../data/stage1/map'
import { shade } from './shade'
import { stroke } from './stroke'

export function clump(p: Pixels, x: number, y: number, R: () => number, n: number, len: number, k = 1) {
  const Z = Z0 * k
  shade(p, x + 5 * Z, y + 2 * k, len * .8, len * .32)
  p.oval(x, y, 8 * Z, 3 * k, () => C.g0)
  Array.from({ length: n }, (_, i) => ((i + R() * .8) / n - .5) * 2).sort((a, b) => Math.abs(b) - Math.abs(a)).forEach(j => {
    const l = len * (1 - .35 * Math.abs(j)) * (.7 + R() * .4), w = (1.5 + R() * .9) * Z, tone = R() < .3 ? C.cLight : C.g2
    stroke(p, x + j * 7 * Z, y + (R() - .5) * 2 * k, -1.571 + j * 1.15 + (R() - .5) * .3, l, j * l * .45 * (.5 + R()),
      u => .5 + w * (u < .65 ? .75 + u * .4 : (1 - (u - .65) / .35) ** .6),
      (s, u) => s > .45 ? C.g0 : u > .55 && s < -.1 ? C.g3 : tone)
  })
}
