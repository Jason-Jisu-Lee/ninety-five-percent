import { hash } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { POND, type Look } from '../../data/place/looks'
import { mud } from '../../world/place/cover'
import { fine, ovals } from '../../world/place/isles'
import type { Kit } from '../../world/place/kit'
import { canopy } from './canopy'

type Oval = { x: number; y: number; rx: number; ry: number }

export const RIVER: Look = { ...POND, water: ['#0f2c40', '#17405a', '#1f5870', '#2f7488', '#a5dcd4'] }
export const MEADOW: Look = { ...POND, grass: ['#2a5a35', '#3b7a40', '#4e9247', '#86c05a'], earth: ['#3d2f28', '#63503c', '#87704e', '#ab9566'] }
export const FOREST: Look = { ...POND, grass: ['#16332a', '#1f4632', '#2b5a3a', '#4f8a4a'], earth: ['#231c1c', '#3d3029', '#57463a', '#7a664c'], shade: ['#0b1d17', '#132e22', '#1d442e', '#2f6a3e'] }
export const GRAVEL = ['#57524c', '#7d776c', '#a39c8c', '#c8c1ae']
const BUSH = ['#1c4a34', '#2c6a40', '#44894a', '#74b45c']
export const STUMP = ['..effffe..', '.efggggfe.', 'efgzzzzgfe', 'efgzggzgfe', 'efgzgezgfe', 'efgzzzzgfe', '.efggggfe.', '..effffe..']

const made = new Map<number, string[]>()

export function rock(rx: number) {
  const ry = Math.round(rx * .68), solid = (x: number, y: number) => ((x + .5) / rx) ** 2 + ((y + .5) / ry) ** 2 <= 1
  if (!made.has(rx)) made.set(rx, Array.from({ length: ry * 2 }, (_, j) => Array.from({ length: rx * 2 }, (_, i) => {
    const x = i - rx, y = j - ry
    return !solid(x, y) ? '.' : !solid(x + 1, y + 2) || !solid(x + 2, y + 3) ? 'a' : Math.hypot((x + rx * .36) / rx, (y + ry * .44) / ry) < .22 ? 'd' : y + x * .35 < -ry * .08 ? 'c' : 'b'
  }).join('')))
  return made.get(rx)!
}

export function rocks(K: Kit, list: number[][]) {
  for (const [x, y, rx] of list) {
    const art = rock(rx), top = y - art.length
    K.sprite(art, x - rx, top, false, K.k, 3)
    K.queue(y, () => {
      for (let i = 2; i < rx * 2 - 2; i++) if (K.b.is(x - rx + i, y, K.L.water.slice(0, 4))) K.b.set(x - rx + i, y, K.L.water[i % 7 < 5 ? 4 : 3])
    })
  }
  K.zone('stones', list[0][0], list[0][1] - 8, 34, 22)
}

export function trees(K: Kit, list: Oval[], s: number) {
  K.queue(900, () => canopy(K.b, fine(ovals(list, s, 3, .8, .4)), K.L, s))
  for (const o of list) K.zone('shade', o.x, o.y, o.rx * .8, o.ry * .8)
}

export function bushes(K: Kit, list: number[][]) {
  const k = { ...K.k, a: BUSH[0], b: BUSH[1], c: BUSH[2], d: BUSH[3] }
  for (const [x, y] of list) K.sprite(rock(8 + (K.R() * 7 | 0)), x, y, false, k, 3)
}

export const patch = (K: Kit, list: Oval[], s: number, tone: string[]) => K.queue(-2, () => mud(K.b, fine(ovals(list, s, 3)), { ...K.L, earth: tone }))

export function drift(K: Kit, x: number, y: number, rx: number, ry: number, tints: string[]) {
  K.queue(-1, () => {
    for (let j = -ry; j <= ry; j += 4) for (let i = -rx + (j / 4 & 1) * 3; i <= rx; i += 6) {
      const px = Math.round(x + i + hash(i, j, 3) * 3), py = Math.round(y + j + hash(i, j, 5) * 2), col = tints[hash(i, j, 9) * tints.length | 0]
      if ((i / rx) ** 2 + (j / ry) ** 2 > 1 - hash(i, j, 7) * .5 || !K.dry(px, py, 3)) continue
      K.b.set(px, py, col)
      K.b.set(px + 1, py, col)
      K.b.set(px, py + 1, K.L.reed[1])
    }
  })
  K.zone('flowers', x, y, rx, ry)
}

export function spots(K: Kit, n: number, far: number, gap = 70, ok = (_x: number, _y: number) => true) {
  const out: number[][] = []
  for (let i = 0; i < 900 && out.length < n; i++) {
    const x = Math.round(16 + K.R() * (W - 32)), y = Math.round(24 + K.R() * (H - 44))
    if (K.dry(x, y, far) && ok(x, y) && out.every(([ox, oy]) => Math.hypot(ox - x, oy - y) > gap)) out.push([x, y])
  }
  return out
}

export const hole = (K: Kit, x: number, y: number, rx: number, ry: number) => K.queue(y, () => {
  for (let j = -ry; j <= ry; j++) for (let i = -rx; i <= rx; i++) if ((i / rx) ** 2 + (j / ry) ** 2 <= 1) K.b.set(x + i, y + j, j < -ry * .3 ? '#05090b' : '#0b1215')
})
