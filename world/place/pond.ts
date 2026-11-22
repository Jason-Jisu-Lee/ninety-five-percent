import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { POND } from '../../data/place/looks'
import { kit } from './kit'
import { shape, tidy } from './land'
import { STONE } from './rocks'

const CW = 40, CH = 23, WIDE = 18.8, TALL = 10.4, CX = W / 2, CY = 182

export function pond(seed = 12) {
  const K = kit(seed, POND), { R } = K, s = seed % 997
  const pool = (i: number, j: number, k: number, c = 1) => i >= c && j >= c && i < (CW - 1) * c && j < (CH - 2) * c && (i >= 15 * c || j >= 5 * c) &&
    (((i + .5) / c - CW / 2) / (WIDE * k)) ** 2 + (((j + .5) / c - 11.4) / (TALL * k)) ** 2 < .68 + vnoise(i / c / 3.2, j / c / 2.6, s) * .5
  const rim = (a: number, k: number): [number, number] => [Math.round(CX + Math.cos(a) * WIDE * 16 * k), Math.round(CY + Math.sin(a) * TALL * 16 * k)]
  const coast = (a: number, back: number): [number, number] => {
    let k = .4
    while (k < 1.3 && K.wet(...rim(a, k + .02), 4)) k += .02
    return rim(a, k - back)
  }
  K.lay(shape(tidy((i, j) => !pool(i, j, 1), CW, CH)), shape(tidy((i, j) => pool(i, j, .6, 2), CW * 2, 45), 8, 3), shape(tidy((i, j) => vnoise(i / 4.5, j / 3.5, s + 4) > .56, CW, CH)))
  ;[[2.95, 3], [1.78, 2], [.62, 3], [-.42, 2]].forEach(([a, n]) => {
    const [x, y] = coast(a, .07)
    K.reeds(x, y + 8, n)
    K.blooms(x + (x < CX ? -30 : 30), y - 10, 2, [4])
  })
  ;[[2.5, .56, 7], [-.95, .52, 5], [1.25, .56, 6]].forEach(([a, k, n]) => K.pads(...rim(a, k), n))
  K.pads(...rim(.1, .66), 3, false)
  K.stones(...coast(2.2, .03), 4)
  K.log(rim(.95, .72)[0] - 10, rim(.95, .72)[1], 72, -5)
  ;[[42, 114, 5, [0, 1, 5, 3]], [66, 326, 6, [1, 0, 2, 3]], [522, 338, 6, [5, 0, 1, 3]], [608, 200, 3, [2, 0]], [604, 92, 3, [0, 5]], [336, 352, 3, [1, 3]]].forEach(([x, y, n, kinds]) => K.blooms(x as number, y as number, n as number, kinds as number[]))
  K.stones(590, 300, 2)
  for (let i = 0, n = 0; i < 400 && n < 26; i++) {
    const x = Math.round(10 + R() * (W - 20)), y = Math.round(20 + R() * (H - 24)), clear = K.zones.every(z => Math.abs(z.x - x) > z.rx + 2 || Math.abs(z.y - y) > z.ry + 6) && !(x > 330 && y < 60) && !(x < 236 && y < 90)
    if (!clear || !K.dry(x, y, 9)) continue
    if (++n % 4) K.tuft(x, y)
    else K.sprite(STONE[2], x, y, R() < .5, K.k, 1)
  }
  K.swarms.push([252, 150], [392, 160], [392, 160], [300, 236], [424, 230], [42, 100], [66, 312], [522, 324])
  K.zone('open', CX, CY, 96, 50)
  return K.done()
}
