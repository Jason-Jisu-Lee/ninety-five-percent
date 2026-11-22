import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { CH, CW, fine, ovals } from '../../world/place/isles'
import { kit } from '../../world/place/kit'
import { tidy } from '../../world/place/land'
import { beast, bird, COAT } from './fauna'
import { bushes, GRAVEL, patch, RIVER, rocks, spots, STUMP, trees } from './props'

export function river2(seed: number) {
  const K = kit(seed, RIVER, .4), { R } = K, s = seed % 997, side = R() < .5 ? 1 : -1, bar = { x: W / 2 - side * 110, y: 204, rx: 118 + R() * 20, ry: 30 + R() * 8 }
  const isle = ovals([bar], s + 1, 3, .8, .4), bank = tidy((i, j) => j * 8 < 26 + vnoise(i / 5, 0, s) * 44 || j * 8 > 326 - vnoise(i / 5, 9, s) * 40 || isle(i, j), CW, CH)
  K.lay(fine(bank), fine(tidy((i, j) => Math.abs(j * 8 - 180) < 70 + vnoise(i / 6, j / 6, s + 9) * 30 && !isle(i, j) && Math.abs(i * 8 - bar.x) > bar.rx * .7, CW, CH)), fine(tidy((i, j) => vnoise(i / 6, j / 5, s + 4) > .56, CW, CH)), 1.8, 4)
  patch(K, [{ ...bar, rx: bar.rx * 1.2, ry: bar.ry * 1.3 }], s + 6, GRAVEL)
  rocks(K, [[0, 0, 15], [28, 12, 9], [-22, 14, 8], [10, 26, 6]].map(([dx, dy, r]) => [W / 2 + side * 170 + dx, 120 + dy, r]))
  rocks(K, [[bar.x - 60, bar.y + 4, 8], [bar.x + 70, bar.y - 6, 6]])
  K.log(Math.round(bar.x - 50), Math.round(bar.y - 12), 96, side * 5)
  K.sprite(STUMP, Math.round(bar.x + 30), Math.round(bar.y + 2))
  bushes(K, [[Math.round(bar.x - 30), Math.round(bar.y - 16)], ...spots(K, 4, 12, 90, (_x, y) => y < 60 || y > 300)])
  K.reeds(Math.round(bar.x + bar.rx * .5), Math.round(bar.y + bar.ry + 6), 3)
  K.reeds(Math.round(W / 2 + side * 60), 316, 4)
  K.pads(Math.round(W / 2 + side * 150), 262, 5, false)
  bird(K, W / 2 + side * 70, 176, 38, COAT.duck, side > 0, false)
  bird(K, W / 2 + side * 20, 96, 14, COAT.fisher, side < 0)
  beast(K, Math.round(bar.x + 60), Math.round(bar.y + 8), 16, COAT.rat, false, .5)
  trees(K, [0, 1, 2, 3].map(i => ({ x: 90 + i * 150 + R() * 60, y: i % 2 ? H + 4 : -4, rx: 70 + R() * 26, ry: 34 + R() * 10 })), s)
  K.zone('open', W / 2 + side * 80, 186, 90, 40)
  return K.done()
}
