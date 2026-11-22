import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { kit } from './kit'
import { shape, tidy } from './land'
import { POND } from './looks'

const SETS = [[0, 3], [0, 2], [0], [2, 3], [0, 2, 3]], CW = 40, CH = 23
const RING = [[84, 190], [128, 282], [246, 310], [392, 308], [508, 282], [560, 190], [512, 96], [392, 60], [250, 60], [138, 100]]

export function pond1(seed: number) {
  const K = kit(seed, POND[0]), { R } = K, corners = K.pick(SETS).map(c => ({ c, rx: 9 + R() * 4, ry: 4.5 + R() * 2 })), s = seed % 997
  const cell = tidy((i, j) => corners.some(({ c, rx, ry }) => ((c & 1 ? CW - 1 - i : i) / rx) ** 2.2 + ((c & 2 ? CH - 1 - j : j) / ry) ** 2.2 < .8 + vnoise(i / 3, j / 3, s) * .45), CW, CH)
  const ox = (R() - .5) * 5, oy = (R() - .5) * 2
  const deep = shape(tidy((i, j) => ((i - CW + ox * 2) / 24) ** 2 + ((j - 22.5 + oy * 2) / 12) ** 2 < .7 + vnoise(i / 7, j / 7, s + 9) * .5 && !cell(i >> 1, j >> 1), CW * 2, 45), 8, 3)
  K.lay(shape(cell), deep, shape(tidy((i, j) => vnoise(i / 2.5, j / 2, s + 4) > .52, CW, CH)))
  for (const { c, rx, ry } of corners) {
    const fx = c & 1 ? -1 : 1, fy = c & 2 ? -1 : 1, at = (u: number, v: number) => [Math.round((c & 1 ? W : 0) + fx * rx * 16 * u), Math.round((c & 2 ? H : 0) + fy * ry * 16 * v)]
    const [bx, by] = at(.36, .46)
    K.blooms(bx, by + 8, 5 + (R() * 4 | 0), c & 1 ? [0, 2, 0, 3] : [1, 0, 1, 3])
    for (let i = 0; i < 6; i++) {
      const [x, y] = at(.08 + R() * .8, .1 + R() * .6)
      if (K.dry(x, y, 9) && Math.hypot(x - bx, y - by) > 40) K.tuft(x, y)
    }
    let [x, y] = at(.62, .5)
    while (!K.wet(x, y, 5) && y > 8 && y < H - 8) y += fy * 4
    if (K.wet(x, y)) K.reeds(x, y + (fy > 0 ? 9 : -5), 2 + (R() * 2 | 0))
  }
  K.ring(RING.filter(([x, y]) => K.wet(x, y, 46)), [
    (x, y) => K.pads(x, y, 7), (x, y) => K.stones(x, y, 3 + (R() * 2 | 0)), (x, y) => K.pads(x, y, 5), (x, y) => K.log(x - 40, y, 70 + (R() * 30 | 0), K.pick([4, -5, 6])),
    (x, y) => K.pads(x, y, 4), (x, y) => K.reeds(x, y + 20, 2), (x, y) => K.pads(x, y, 3, false),
  ])
  K.zone('open', W / 2 - ox * 16, H / 2 - oy * 16, 96, 52)
  return K.done()
}
