import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { canopy } from './cover'
import { kit } from './kit'
import { shape, tidy } from './land'
import { POND } from './looks'

const CW = 40, CH = 23, RING = [[118, 196], [150, 280], [262, 300], [392, 300], [500, 270], [528, 186], [486, 108], [380, 82], [262, 82], [160, 112]]

export function pond3(seed: number) {
  const K = kit(seed, POND[2]), { R } = K, s = seed % 997, ox = (R() - .5) * 4, oy = (R() - .5) * 1.5
  const glade = (i: number, j: number, k: number, c = 1) => (((i + .5) / c - CW / 2 + ox) / (17 * k)) ** 2 + (((j + .5) / c - 11.6 + oy) / (9 * k)) ** 2 < .8 + vnoise(i / c / 2.6, j / c / 2.6, s) * .5
  const leaves = shape(tidy((i, j) => !glade(i, j, 1), CW, CH)), lit = tidy((i, j) => glade(i, j, .6, 2), CW * 2, 45)
  K.lay(new Uint8Array(W * H), shape((i, j) => !lit(i, j), 8, 3), null, 1.4)
  K.ring(RING.filter(([x, y]) => [[0, 0], [-40, 0], [40, 0], [0, -28], [0, 28]].every(([dx, dy]) => !leaves[(y + dy) * W + x + dx])), [
    (x, y) => K.pads(x, y, 7), (x, y) => K.reeds(x, y + 22, 2), (x, y) => K.pads(x, y, 5), (x, y) => K.stones(x, y + 8, 4),
    (x, y) => K.pads(x, y, 4), (x, y) => K.log(x - 36, y, 64 + (R() * 24 | 0), K.pick([4, -5, 6])), (x, y) => K.pads(x, y, 3),
  ])
  K.queue(999, () => canopy(K.b, leaves, K.L, s))
  for (const [x, y, rx, ry] of [[70, 60, 62, 40], [W - 70, H - 56, 62, 40], [70, H - 56, 62, 40]]) K.zone('shade', x, y, rx, ry)
  K.zone('open', W / 2 - ox * 16, 182 - oy * 16, 96, 50)
  return K.done()
}
