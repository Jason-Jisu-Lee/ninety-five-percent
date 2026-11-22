import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { CH, CW, fine } from '../../world/place/isles'
import { kit } from '../../world/place/kit'
import { tidy } from '../../world/place/land'
import { beast, bird, COAT } from './fauna'
import { bushes, drift, hole, MEADOW, patch, rocks, spots, STUMP, trees } from './props'

export const TALL = ['#235239', '#2a6038', '#2f6b41', '#3c7f49'], PETALS = ['#f4efe1', '#f4cf52', '#a98be0', '#f0a3b6']

export function land1(seed: number) {
  const K = kit(seed, MEADOW, .4), { R } = K, s = seed % 997, side = R() < .5 ? 1 : -1, brook = (x: number) => 262 + x * .5 + Math.sin(x / 40) * 12
  const wet = tidy((i, j) => (side > 0 ? i * 8 : W - i * 8) < 210 && Math.abs(j * 8 + 4 - brook(side > 0 ? i * 8 : W - i * 8)) < 12, CW, CH)
  K.lay(fine((i, j) => !wet(i, j)), null, fine(tidy((i, j) => vnoise(i / 8, j / 6, s + 4) > .54, CW, CH)), 1, 3)
  patch(K, spots(K, 4, 30, 150).map(([x, y]) => ({ x, y, rx: 50 + R() * 30, ry: 26 + R() * 12 })), s + 2, TALL)
  patch(K, Array.from({ length: 11 }, (_, i) => ({ x: W / 2 - side * (290 - i * 58), y: 60 + i * 26 + Math.sin(i * .9) * 16, rx: 44, ry: 13 })), s + 6, K.L.earth)
  for (const [x, y] of spots(K, 5, 24, 110)) drift(K, x, y, 30 + R() * 14, 15, PETALS)
  for (const [x, y] of spots(K, 12, 10, 40)) K.tuft(x, y)
  rocks(K, spots(K, 3, 18, 160).map(([x, y]) => [x, y, 7 + (R() * 8 | 0)]))
  K.log(Math.round(W / 2 + side * 120), 268, 88, -5)
  for (const [x, y] of spots(K, 2, 14, 200)) K.sprite(STUMP, x, y)
  const [den] = spots(K, 1, 26, 0, (x, y) => Math.abs(x - W / 2) > 150 && y > 110)
  patch(K, [{ x: den[0], y: den[1], rx: 22, ry: 13 }], s + 8, K.L.earth)
  hole(K, den[0], den[1] - 2, 7, 4)
  bushes(K, spots(K, 7, 14, 70))
  beast(K, den[0] + 30, den[1] + 8, 20, COAT.rabbit, R() < .5, .08)
  beast(K, W / 2 - side * 150, 150, 20, COAT.rabbit, true, .08)
  beast(K, W / 2 + side * 60, 96, 36, COAT.fox, side > 0, .5)
  beast(K, W / 2 - side * 40, 258, 50, COAT.lynx, side < 0, .1)
  bird(K, W / 2 + side * 180, 170, 22, COAT.crow, false, true, '#3a424a')
  trees(K, [{ x: 40, y: 20, rx: 80, ry: 44 }, { x: W - 60, y: 24, rx: 110, ry: 52 }, { x: W - 30, y: H - 20, rx: 60, ry: 36 }], s)
  K.zone('open', W / 2, H / 2, 90, 44)
  return K.done()
}
