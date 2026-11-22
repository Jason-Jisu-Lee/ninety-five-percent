import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { CH, CW, fine } from '../../world/place/isles'
import { kit } from '../../world/place/kit'
import { tidy } from '../../world/place/land'
import { beast, bird, COAT } from './fauna'
import { bushes, drift, GRAVEL, patch, RIVER, rocks, spots, trees } from './props'

export function river1(seed: number) {
  const K = kit(seed, RIVER, .4), { R } = K, s = seed % 997, ph = R() * 6, lean = (R() - .5) * .16
  const mid = (x: number) => 184 + Math.sin(x / 130 + ph) * 44 + (x - W / 2) * lean, wide = (x: number) => 84 + Math.sin(x / 80 + ph * 2) * 14
  const flow = (k: number) => tidy((i, j) => Math.abs(j * 8 + 4 - mid(i * 8 + 4)) < wide(i * 8 + 4) * k + (vnoise(i / 4, j / 4, s) - .5) * 26, CW, CH), wet = flow(1)
  K.lay(fine((i, j) => !wet(i, j)), fine(flow(.5)), fine(tidy((i, j) => vnoise(i / 6, j / 5, s + 4) > .56, CW, CH)), 1.8, 4)
  patch(K, [[150 + R() * 60, -1], [430 + R() * 60, 1]].map(([x, side]) => ({ x, y: mid(x) + side * (wide(x) + 4), rx: 70 + R() * 20, ry: 20 })), s + 6, GRAVEL)
  rocks(K, [0, 1, 2, 3, 4].map(i => {
    const x = Math.round(80 + i * 118 + R() * 40)
    return [x, Math.round(mid(x) + (R() - .5) * wide(x) * 1.2), 7 + (R() * 9 | 0)]
  }))
  K.log(Math.round(230 + R() * 140), Math.round(mid(300) - wide(300)), 120, 4)
  bushes(K, spots(K, 6, 14))
  for (const [x, y] of spots(K, 3, 22, 120)) drift(K, x, y, 26, 13, ['#f4efe1', '#f4cf52', '#a98be0'])
  for (const x of [120 + R() * 80, 420 + R() * 120]) K.reeds(Math.round(x), Math.round(mid(x) + wide(x) - 16), 3)
  K.pads(Math.round(300 + R() * 60), Math.round(mid(330) + wide(330) * .55), 5, false)
  bird(K, 344, Math.round(mid(344)) + 6, 38, COAT.duck, R() < .5, false)
  bird(K, 470, Math.round(mid(470)) - 44, 14, COAT.fisher, false)
  beast(K, 196, Math.round(mid(196) - wide(196) - 16), 16, COAT.rat, true, .5)
  trees(K, [{ x: 50, y: 26, rx: 76, ry: 44 }, { x: 160, y: 8, rx: 54, ry: 26 }, { x: W - 46, y: H - 26, rx: 84, ry: 46 }, { x: W - 180, y: H - 6, rx: 54, ry: 24 }], s)
  K.zone('open', W / 2, mid(W / 2), 90, 40)
  return K.done()
}
