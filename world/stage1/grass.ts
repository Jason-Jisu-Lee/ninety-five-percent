import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'
import { shade } from './shade'
import { stroke } from './stroke'

export function clump(p: Pixels, x: number, y: number, R: () => number, n: number, len: number) {
  shade(p, x + 5, y + 2, len * .8, len * .32)
  p.oval(x, y, 8, 3, () => C.g0)
  Array.from({ length: n }, (_, i) => ((i + R() * .8) / n - .5) * 2).sort((a, b) => Math.abs(b) - Math.abs(a)).forEach(k => {
    const l = len * (1 - .35 * Math.abs(k)) * (.7 + R() * .4), w = 1.5 + R() * .9, tone = R() < .3 ? C.cLight : C.g2
    stroke(p, x + k * 7, y + (R() - .5) * 2, -1.571 + k * 1.15 + (R() - .5) * .3, l, k * l * .45 * (.5 + R()),
      u => .5 + w * (u < .65 ? .75 + u * .4 : (1 - (u - .65) / .35) ** .6),
      (s, u) => s > .45 ? C.g0 : u > .55 && s < -.1 ? C.g3 : tone)
  })
}
