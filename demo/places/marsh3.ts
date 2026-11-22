import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { canopy } from './cover'
import { afloat, CH, CW, edge, fine, mats, ovals, tufts } from './isles'
import { kit } from './kit'
import { tidy } from './land'
import { MARSH } from './looks'

const SPOTS = [[150, 120], [136, 250], [300, 292], [470, 270], [508, 140], [330, 80]]

export function marsh3(seed: number) {
  const K = kit(seed, MARSH[2], .55), { R } = K, s = seed % 997, turn = R() * SPOTS.length | 0
  const glade = (i: number, j: number, k: number) => ((i + .5 - 40) / (33 * k)) ** 2 + ((j + .5 - 23) / (18 * k)) ** 2 < .8 + vnoise(i / 5, j / 5, s) * .5
  const leaves = fine(tidy((i, j) => !glade(i, j, 1), CW, CH)), lit = tidy((i, j) => glade(i, j, .55), CW, CH)
  const isles = SPOTS.filter((_, i) => (i + turn) % 3 !== 2).map(([x, y]) => ({ x: x + (R() - .5) * 30, y: y + (R() - .5) * 20, rx: 30 + R() * 26, ry: 18 + R() * 12 })), land = fine(ovals(isles, s))
  K.lay(land, fine((i, j) => !lit(i, j)), null, 1.4)
  mats(K, isles.slice(0, 2).map(o => ({ x: o.x + (o.x < W / 2 ? 1 : -1) * (o.rx + 14), y: o.y + 10, rx: 34 + R() * 12, ry: 22 + R() * 6 })), land, s)
  isles.forEach((o, i) => {
    const x = Math.round(o.x), y = Math.round(o.y)
    tufts(K, o, o.rx / 6)
    if (i % 2 && K.dry(x, y, 12)) K.blooms(x, y + 4, 4, [2, 3, 0, 1])
    else if (K.dry(x, y, 10)) K.stones(x, y + 6, 2)
    K.reeds(x - 6, edge(K, x - 6, y) + 5, 3 + (R() * 2 | 0))
  })
  afloat(K, 7, 60, (x, y) => x > 90 && x < W - 90 && y > 70 && y < H - 70 && !leaves[y * W + x]).forEach(([x, y], i) => i === 1 ? K.snag(x, y + 8) : i === 4 ? K.log(x - 20, y, 40, K.pick([4, -5])) : K.pads(x, y, 5 + (R() * 3 | 0), i % 2 === 0))
  K.queue(999, () => canopy(K.b, leaves, K.L, s))
  for (const [x, y] of [[60, 50], [W - 60, H - 50], [60, H - 50]]) K.zone('shade', x, y, 54, 36)
  K.zone('open', W / 2, H / 2, 76, 38)
  return K.done()
}
