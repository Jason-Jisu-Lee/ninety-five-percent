import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { CH, CW, fine } from '../../world/place/isles'
import { kit } from '../../world/place/kit'
import { tidy } from '../../world/place/land'
import { beast, COAT } from './fauna'
import { drift, FOREST, patch, rocks, spots, STUMP, trees } from './props'

export const MOSS = ['#1f4632', '#2b5a3a', '#3a6f40', '#5c9448'], LITTER = ['#8a5a2a', '#b0763a', '#6a4424'], CAPS = ['#d8442c', '#f4efe1']

export function forest1(seed: number) {
  const K = kit(seed, FOREST, .4), { R } = K, s = seed % 997, side = R() < .5 ? 1 : -1, glade = (x: number, y: number) => ((x - W / 2) / 230) ** 2 + ((y - 186) / 118) ** 2 < 1
  K.lay(new Uint8Array(W * H).fill(1), null, fine(tidy((i, j) => vnoise(i / 8, j / 6, s + 4) > .56, CW, CH)), 1, 3)
  patch(K, spots(K, 4, 30, 130, glade).map(([x, y]) => ({ x, y, rx: 50 + R() * 30, ry: 24 + R() * 12 })), s + 2, MOSS)
  patch(K, spots(K, 3, 30, 150, glade).map(([x, y]) => ({ x, y, rx: 40 + R() * 20, ry: 16 + R() * 8 })), s + 5, K.L.earth)
  for (const [x, y] of spots(K, 5, 20, 100, glade)) drift(K, x, y, 34 + R() * 14, 16, LITTER)
  for (const [x, y] of spots(K, 3, 20, 140, glade)) drift(K, x, y, 12, 6, CAPS)
  for (const [x, y] of spots(K, 18, 10, 36, glade)) K.tuft(x, y)
  K.log(Math.round(W / 2 - side * 60 - 85), 262, 170, side * 6)
  rocks(K, spots(K, 4, 18, 130, glade).map(([x, y]) => [x, y, 9 + (R() * 10 | 0)]))
  for (const [x, y] of spots(K, 3, 14, 120, glade)) K.sprite(STUMP, x, y)
  beast(K, W / 2 + side * 130, 132, 64, COAT.wolf, side > 0, .3)
  beast(K, W / 2 + side * 170, 206, 60, COAT.wolf, side > 0, .3)
  beast(K, W / 2 - side * 80, 170, 84, COAT.bear, side < 0, .04)
  trees(K, Array.from({ length: 16 }, (_, i) => {
    const a = i / 16 * 6.283 + R() * .2
    return { x: W / 2 + Math.cos(a) * 330, y: 186 + Math.sin(a) * 196, rx: 76 + R() * 30, ry: 50 + R() * 18 }
  }), s)
  K.zone('open', W / 2, 186, 100, 50)
  return K.done()
}
