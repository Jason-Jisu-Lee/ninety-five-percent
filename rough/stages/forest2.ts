import { vnoise } from '../../core/math/noise'
import { W } from '../../data/look/screen'
import { CH, CW, fine } from '../../world/place/isles'
import { kit } from '../../world/place/kit'
import { tidy } from '../../world/place/land'
import { beast, COAT } from './fauna'
import { CAPS, LITTER, MOSS } from './forest1'
import { bushes, drift, FOREST, hole, patch, rocks, spots, STUMP, trees } from './props'

export function forest2(seed: number) {
  const K = kit(seed, FOREST, .4), { R } = K, s = seed % 997, side = R() < .5 ? 1 : -1, cave = W / 2 + side * 40, creek = (x: number) => 300 - (W - x) * .34 + Math.sin(x / 36) * 10
  const open = (x: number, y: number) => Math.abs(x - W / 2) < 210 && y > 130 && y < 330, far = (i: number) => side > 0 ? W - i * 8 : i * 8
  const wet = tidy((i, j) => far(i) < 240 && Math.abs(j * 8 + 4 - creek(W - far(i))) < 10, CW, CH)
  K.lay(fine((i, j) => !wet(i, j)), null, fine(tidy((i, j) => vnoise(i / 8, j / 6, s + 4) > .56, CW, CH)), 1, 3)
  patch(K, [{ x: cave, y: 132, rx: 80, ry: 26 }, ...spots(K, 2, 30, 150, open).map(([x, y]) => ({ x, y, rx: 40 + R() * 20, ry: 16 + R() * 8 }))], s + 5, K.L.earth)
  patch(K, spots(K, 3, 30, 130, open).map(([x, y]) => ({ x, y, rx: 50 + R() * 30, ry: 24 + R() * 12 })), s + 2, MOSS)
  for (const [x, y] of spots(K, 4, 20, 100, open)) drift(K, x, y, 34 + R() * 14, 16, LITTER)
  for (const [x, y] of spots(K, 2, 20, 140, open)) drift(K, x, y, 12, 6, CAPS)
  for (const [x, y] of spots(K, 16, 10, 36, open)) K.tuft(x, y)
  rocks(K, [[-92, 96, 22], [-58, 84, 30], [-10, 76, 40], [50, 80, 36], [94, 94, 26], [-120, 112, 12], [124, 110, 14], [-30, 60, 26], [30, 58, 24]].map(([dx, y, r]) => [cave + dx, y, r]))
  hole(K, cave + 6, 92, 20, 13)
  K.log(Math.round(W / 2 - side * 170 - 60), 250, 130, -side * 6)
  for (const [x, y] of spots(K, 2, 14, 120, open)) K.sprite(STUMP, x, y)
  const berries = spots(K, 4, 14, 80, open)
  bushes(K, berries)
  for (const [x, y] of berries) K.queue(y + 30, () => [[5, 3], [10, 2], [13, 6], [7, 8], [3, 6]].forEach(([dx, dy]) => K.b.set(x + dx, y + dy, '#d8442c')))
  beast(K, cave + 4, 148, 84, COAT.bear, side > 0, .04)
  beast(K, W / 2 - side * 150, 300, 62, COAT.wolf, side < 0, .3)
  trees(K, [...[0, 1, 2, 3].flatMap(i => [{ x: 20 + R() * 30, y: 30 + i * 100, rx: 70 + R() * 20, ry: 56 }, { x: W - 20 - R() * 30, y: 30 + i * 100, rx: 70 + R() * 20, ry: 56 }]), { x: cave - 190, y: 20, rx: 80, ry: 40 }, { x: cave + 190, y: 20, rx: 80, ry: 40 }], s)
  K.zone('open', W / 2, 220, 100, 50)
  return K.done()
}
