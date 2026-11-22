import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { kit } from './kit'
import { shape, tidy } from './land'
import { POND } from './looks'

const CW = 40, CH = 23, MEADOW = [[62, 120], [58, 250], [170, 330], [330, 338], [480, 330], [584, 250], [578, 150], [200, 42], [330, 34]]

export function pond2(seed: number) {
  const K = kit(seed, POND[1]), { R } = K, s = seed % 997, ox = (R() - .5) * 3, oy = (R() - .5) * 1.2, wide = 13.5 + R() * 2, tall = 7.4 + R()
  const pool = (i: number, j: number, k: number, c = 1) => Math.abs(((i + .5) / c - CW / 2 + ox) / (wide * k)) ** 2.1 + Math.abs(((j + .5) / c - 11.4 + oy) / (tall * k)) ** 2.1 < .78 + vnoise(i / c / 2.6, j / c / 2.6, s) * .5
  const cell = tidy((i, j) => !pool(i, j, 1), CW, CH), cx = W / 2 - ox * 16, cy = 182 - oy * 16, rx = wide * 16, ry = tall * 16
  K.lay(shape(cell), shape(tidy((i, j) => pool(i, j, .62, 2), CW * 2, 45), 8, 3), shape(tidy((i, j) => vnoise(i / 4.5, j / 3.5, s + 4) > .56, CW, CH)))
  K.ring(MEADOW, [
    (x, y) => K.blooms(x, y, 8, [0, 1, 0, 3]), (x, y) => K.stones(x, y, 3), (x, y) => K.blooms(x, y, 6, [2, 0, 2, 3]), (x, y) => K.log(x - 34, y - 6, 60 + (R() * 20 | 0), K.pick([5, -5])),
    (x, y) => K.blooms(x, y, 7, [1, 3, 1, 0]), (x, y) => K.blooms(x, y, 4, [0, 2]),
  ])
  for (let i = 0; i < 26; i++) {
    const x = 12 + R() * (W - 24), y = 22 + R() * (H - 30)
    if (K.dry(x, y, 10) && K.zones.every(z => Math.abs(z.x - x) > z.rx + 6 || Math.abs(z.y - y) > z.ry + 8) && !(x > 380 && y < 62)) K.tuft(Math.round(x), Math.round(y))
  }
  const rim = (a: number, k: number) => [Math.round(cx + Math.cos(a) * rx * k), Math.round(cy + Math.sin(a) * ry * k)], turn = R() * 6.283
  for (const [a, n] of [[-1.9 + R() * .5, 3], [-.9 + R() * .4, 2], [2.6 + R() * .5, 2]]) {
    let [x, y] = rim(a, .78)
    while (K.wet(x, y - 10, 6) && y > 20) y -= 4
    K.reeds(x, y + 6, n)
  }
  ;[0, 1, 2].forEach(i => {
    const [x, y] = rim(turn + i * 2.1 + .4, .56)
    K.pads(x, y, [7, 5, 4][i])
  })
  K.zone('open', cx, cy, 92, 46)
  return K.done()
}
