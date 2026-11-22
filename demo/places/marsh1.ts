import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { afloat, CH, CW, edge, fine, mats, ovals, tufts } from './isles'
import { kit } from './kit'
import { tidy } from './land'
import { MARSH } from './looks'

const SPOTS = [[70, 96], [60, 236], [176, 318], [330, 330], [476, 318], [584, 226], [560, 120], [200, 50], [352, 42], [470, 66]]

export function marsh1(seed: number) {
  const K = kit(seed, MARSH[0], .55), { R } = K, s = seed % 997, turn = R() * SPOTS.length | 0
  const isles = SPOTS.map(([x, y], i) => ({ x: x + (R() - .5) * 30, y: y + (R() - .5) * 20, rx: (i + turn) % 3 ? 34 + R() * 34 : 62 + R() * 30, ry: 22 + R() * 20 })).filter((_, i) => (i + turn) % 5 !== 4)
  const cell = ovals(isles, s), land = fine(cell)
  K.lay(land, fine(tidy((i, j) => ((i - 40) / 20) ** 2 + ((j - 22) / 9) ** 2 < .6 + vnoise(i / 6, j / 6, s + 9) * .6 && !cell(i, j), CW, CH)), fine(tidy((i, j) => vnoise(i / 5, j / 4, s + 4) > .56, CW, CH)))
  mats(K, isles.filter((_, i) => i % 3 === 1).map(o => ({ x: o.x + (o.x < W / 2 ? 1 : -1) * (o.rx + 10), y: o.y + 8, rx: 30 + R() * 14, ry: 20 + R() * 8 })), land, s)
  isles.forEach((o, i) => {
    const x = Math.round(o.x), y = Math.round(o.y), wade = edge(K, x - 8, y)
    tufts(K, o, o.rx / 7)
    if (i % 2 && K.dry(x, y, 14)) K.blooms(x, y + 4, 3 + (R() * 3 | 0), [2, 3, 2, 1])
    else if (o.rx > 50 && K.dry(x, y, 10)) K.stones(x, y + 6, 2)
    if (wade < H - 10 && !(x > 380 && wade < 90)) K.reeds(x - 8, wade + 5, 3 + (R() * 3 | 0))
  })
  afloat(K, 9, 70).forEach(([x, y], i) => i === 2 ? K.snag(x, y + 8) : i === 5 ? K.log(x - 20, y, 40, K.pick([4, -5])) : i === 7 ? K.stones(x, y, 2) : K.pads(x, y, 4 + (R() * 4 | 0), i % 2 === 0))
  K.zone('open', W / 2, H / 2, 80, 40)
  return K.done()
}
