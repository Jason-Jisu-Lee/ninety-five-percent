import { vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { weed } from './cover'
import type { Kit } from './kit'
import { shape, tidy, type Mask } from './land'

type Oval = { x: number; y: number; rx: number; ry: number }

export const CW = 80, CH = 45
export const ovals = (list: Oval[], s: number, grain = 4, base = .75, wild = .6) =>
  tidy((i, j) => list.some(o => ((i * 8 + 4 - o.x) / o.rx) ** 2 + ((j * 8 + 4 - o.y) / o.ry) ** 2 < base + vnoise(i / grain, j / grain, s) * wild), CW, CH)
export const fine = (cell: (i: number, j: number) => boolean) => shape(cell, 8, 3)

export function mats(K: Kit, list: Oval[], land: Mask, s: number) {
  K.queue(-1, () => weed(K.b, fine(ovals(list, s + 2, 2.2, .5, .9)), land, K.L))
  list.forEach(m => K.zone('weed', m.x, m.y, m.rx * .8, m.ry * .8))
}

export function tufts(K: Kit, o: Oval, n: number, ok = (_x: number, _y: number) => true) {
  for (let i = 0; i < n; i++) {
    const x = Math.round(o.x + (K.R() - .5) * o.rx * 1.6), y = Math.round(o.y + (K.R() - .5) * o.ry * 1.4)
    if (K.dry(x, y, 7) && ok(x, y)) K.tuft(x, y)
  }
}

export function edge(K: Kit, x: number, y: number) {
  while (K.dry(x, y) && y < H - 6) y += 3
  return y
}

export function afloat(K: Kit, n: number, hole: number, ok = (_x: number, _y: number) => true) {
  const at: number[][] = []
  for (let i = 0; i < 500 && at.length < n; i++) {
    const x = Math.round(40 + K.R() * (W - 80)), y = Math.round(44 + K.R() * (H - 88))
    if (K.wet(x, y, 22) && ok(x, y) && K.zones.every(z => Math.abs(z.x - x) > z.rx + 14 || Math.abs(z.y - y) > z.ry + 10) && at.every(([ax, ay]) => Math.hypot(ax - x, ay - y) > 80) && Math.hypot(x - W / 2, (y - H / 2) * 1.6) > hole) at.push([x, y])
  }
  return at
}
