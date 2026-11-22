import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { MARSH } from '../../data/place/looks'
import { mud } from './cover'
import { afloat, CH, CW, edge, fine, mats, ovals, tufts } from './isles'
import { kit } from './kit'
import { tidy } from './land'

export function marsh(seed = 5) {
  const K = kit(seed, MARSH, .55), { R } = K, s = seed % 997, low = R() < .5 ? 1 : -1
  const banks = [{ x: -20, y: 180 + low * 70, rx: 150 + R() * 40, ry: 96 + R() * 30 }, { x: W + 20, y: 180 - low * 60, rx: 140 + R() * 40, ry: 100 + R() * 30 }]
  const isles = [...banks, ...[[230, 60], [420, 316], [250, 300], [440, 70]].filter(() => R() < .7).map(([x, y]) => ({ x: x + (R() - .5) * 50, y: y + (R() - .5) * 24, rx: 30 + R() * 24, ry: 18 + R() * 12 }))]
  const cell = ovals(isles, s), land = fine(cell)
  K.lay(land, fine(tidy((i, j) => ((i - 40) / 22) ** 2 + ((j - 22) / 11) ** 2 < .6 + vnoise(i / 6, j / 6, s + 9) * .6 && !cell(i, j), CW, CH)), fine(tidy((i, j) => vnoise(i / 5, j / 4, s + 4) > .56, CW, CH)), 1, 4)
  const flats = banks.map(o => ({ x: o.x + (o.x < 0 ? 1 : -1) * o.rx * .55, y: o.y + 10, rx: 44 + R() * 16, ry: 34 + R() * 8 }))
  K.queue(-2, () => mud(K.b, fine(ovals(flats, s + 6, 3)), K.L))
  flats.forEach(m => K.zone('mud', m.x, m.y, m.rx * .7, m.ry * .7))
  mats(K, [[200 + R() * 60, 150 + low * 50], [400 + R() * 60, 190 - low * 50]].map(([x, y]) => ({ x, y, rx: 50 + R() * 20, ry: 30 + R() * 8 })), land, s)
  isles.forEach((o, i) => {
    const side = o.x < W / 2 ? 1 : -1, x = Math.round(i < 2 ? o.x + side * o.rx * .5 : o.x), y = Math.round(o.y), wade = edge(K, x, y)
    tufts(K, o, o.rx / 5, (tx, ty) => flats.every(m => Math.hypot(m.x - tx, (m.y - ty) * 1.3) > m.rx))
    if (i < 2) {
      K.blooms(Math.round(o.x + side * o.rx * .3), y - Math.round(o.ry * .45), 6, [2, 1, 5, 3])
      K.stones(x, y + Math.round(o.ry * .5), 3)
    }
    if (wade < H - 10 && !(x > 380 && wade < 90)) K.reeds(x, wade + 6, i < 2 ? 7 : 3)
  })
  afloat(K, 8, 66).forEach(([x, y], i) => i === 1 ? K.snag(x, y + 8) : i === 4 ? K.log(x - 20, y, 44, K.pick([4, -5])) : i === 6 ? K.reeds(x, y + 12, 3) : K.pads(x, y, 5 + (R() * 3 | 0), i % 2 === 0))
  K.zone('open', W / 2, H / 2, 80, 40)
  return K.done()
}
