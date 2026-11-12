import { fbm, sstep } from '../../core/noise'
import { once } from '../../core/once'
import { rng } from '../../core/rng'
import { FLOWER_PATCHES, REEDS } from '../../data/forest'
import { H, W } from '../../data/screen'
import { river } from './river'
import type { Kind } from './sprites'

export type Prop = { x: number; y: number; j: number } & (
  | { k: 'tuft'; v: number; col: number }
  | { k: 'flower'; kind: Kind; bud: number }
  | { k: 'reed'; h: number; cat: boolean; husk?: boolean }
)

export const props = once(() => {
  const R = rng(4242), { E, bank } = river(), list: Prop[] = []
  for (let gy = 4; gy < H; gy += 9) for (let gx = 4; gx < W; gx += 9) {
    const x = gx + (R() * 7 | 0), y = gy + (R() * 7 | 0)
    if (x >= W - 6 || y >= H || E(x + 3, y) < 7) continue
    if (R() > .2 + sstep(.4, .65, fbm(x / 60, y / 60, 31)) * .6) continue
    const dark = fbm(x / 70 + 40, y / 70, 9) > .57 && fbm(x / 80, y / 80, 5) <= .55
    const v = R() < .5 ? 0 : R() < .6 ? 1 : 2
    list.push({ k: 'tuft', x, y, v, col: R() < (dark ? .3 : .78) ? 0 : 1, j: R() * 12 })
  }
  for (const p of FLOWER_PATCHES) for (let i = 0; i < p.n; i++) {
    const a = R() * 6.283, d = Math.sqrt(R()) * p.spread, x = Math.round(p.x + Math.cos(a) * d), y = Math.round(p.y + Math.sin(a) * d * .7)
    if (E(x, y) >= 8) list.push({ k: 'flower', x, y, kind: p.kind, bud: R() < .3 ? 1 : 0, j: R() * 12 })
  }
  for (const [frac, side, n, cat] of REEDS) for (let i = 0; i < n; i++) {
    const [x, y] = bank(frac + (R() - .5) * .07, side, -4 + R() * 6)
    list.push({ k: 'reed', x, y, h: 11 + (R() * 9 | 0), cat: R() < cat, j: R() * 12 })
  }
  const tallest = list.filter(p => p.k === 'reed').slice(0, 8).sort((a, b) => b.h - a.h)[0]
  Object.assign(tallest, { husk: true, h: 20, cat: false })
  return list.sort((a, b) => a.y - b.y)
})
