import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { CH, CW, fine } from '../../world/place/isles'
import { kit } from '../../world/place/kit'
import { tidy } from '../../world/place/land'
import { beast, bird, COAT } from './fauna'
import { PETALS, TALL } from './land1'
import { bushes, drift, hole, MEADOW, patch, rocks, spots, STUMP, trees } from './props'

export function land2(seed: number) {
  const K = kit(seed, MEADOW, .4), { R } = K, s = seed % 997, side = R() < .5 ? 1 : -1, open = (x: number, y: number) => y > 120 && Math.abs(x - W / 2 - side * 40) < 250
  K.lay(new Uint8Array(W * H).fill(1), null, fine(tidy((i, j) => vnoise(i / 8, j / 6, s + 4) > .54, CW, CH)), 1, 3)
  patch(K, spots(K, 4, 30, 140, open).map(([x, y]) => ({ x, y, rx: 54 + R() * 30, ry: 24 + R() * 12 })), s + 2, TALL)
  for (const [x, y] of spots(K, 5, 24, 100, open)) drift(K, x, y, 30 + R() * 14, 15, PETALS)
  for (const [x, y] of spots(K, 14, 10, 40, open)) K.tuft(x, y)
  rocks(K, spots(K, 3, 18, 150, open).map(([x, y]) => [x, y, 7 + (R() * 9 | 0)]))
  for (const [x, y] of spots(K, 3, 14, 120, open)) K.sprite(STUMP, x, y)
  K.log(Math.round(W / 2 - side * 150), 290, 96, 5)
  const den = [Math.round(W / 2 + side * 90), 112]
  patch(K, [{ x: den[0], y: den[1] + 6, rx: 30, ry: 14 }], s + 8, K.L.earth)
  hole(K, den[0], den[1], 9, 5)
  bushes(K, spots(K, 6, 14, 70, open))
  beast(K, W / 2 - side * 180, 230, 20, COAT.rabbit, false, .08)
  beast(K, W / 2 + side * 30, 310, 20, COAT.rabbit, true, .08)
  beast(K, den[0] - side * 44, den[1] + 30, 36, COAT.fox, side < 0, .5)
  beast(K, W / 2 - side * 30, 190, 50, COAT.lynx, side > 0, .1)
  bird(K, W / 2 + side * 200, 250, 22, COAT.crow, true, true, '#3a424a')
  trees(K, [...[0, 1, 2, 3, 4, 5].map(i => ({ x: 30 + i * 120 + R() * 30, y: 26 + R() * 26, rx: 70 + R() * 20, ry: 44 + R() * 14 })), { x: W / 2 - side * 310, y: 170, rx: 50, ry: 70 }, { x: W / 2 - side * 320, y: 300, rx: 44, ry: 60 }], s)
  K.zone('open', W / 2 + side * 20, 220, 96, 48)
  return K.done()
}
