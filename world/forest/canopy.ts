import { once } from '../../core/once'
import { pixels } from '../../core/pixels'
import { BUSHES, TREES } from '../../data/forest'
import { FOREST as C } from '../../data/palette'
import { H, W } from '../../data/screen'

type Spot = { x: number; y: number; r: number; turn?: number }

export const canopy = once(() => {
  const p = pixels(W, H), mask = new Set<number>()
  const put = (x: number, y: number, c: string) => {
    p.set(x, y, c)
    mask.add(y * W + x)
  }
  const blob = (lobes: number[][], cx: number, cy: number, reach: number, rim: number[], lit: (x: number, y: number) => boolean) => {
    const inside = (x: number, y: number) => lobes.some(([lx, ly, lr]) => (x - lx) ** 2 + (y - ly) ** 2 <= lr * lr)
    for (let y = Math.floor(cy - reach * rim[2]); y <= cy + reach * rim[2]; y++) for (let x = Math.floor(cx - reach * rim[3]); x <= cx + reach * rim[3]; x++) {
      if (inside(x, y)) put(x, y, !inside(x + rim[0] * reach, y + rim[1] * reach) ? C.cDark : lit(x, y) ? C.cLight : C.cMid)
    }
  }
  const tree = ({ x: cx, y: base, r, turn = 0 }: Spot) => {
    const tw = Math.round(r * .2), x0 = cx - (tw >> 1), cy = Math.round(base - 14 - r * .8), lobes = [[cx, cy, r * .62]]
    for (let y = base - 26; y <= base; y++) for (let j = 0; j < tw; j++) put(x0 + j, y, j < 2 ? C.t0 : j >= tw - 3 ? C.t2 : C.t1)
    put(x0 - 1, base, C.t2)
    put(x0 + tw, base, C.t2)
    for (let k = 0; k < 5; k++) {
      const a = k / 5 * 6.283 + turn
      lobes.push([cx + Math.cos(a) * r * .5, cy + Math.sin(a) * r * .44, r * .5])
    }
    blob(lobes, cx, cy, r, [.16, .2, 1.1, 1.1], (x, y) => (x - cx + .34 * r) ** 2 + (y - cy + .2 * r) ** 2 < (.27 * r) ** 2 || (x - cx + .08 * r) ** 2 + (y - cy + .42 * r) ** 2 < (.25 * r) ** 2)
  }
  const bush = ({ x: cx, y: base, r }: Spot) => {
    const cy = Math.round(base - r * .6)
    blob([[cx - r * .4, cy, r * .7], [cx + r * .4, cy + r * .1, r * .7], [cx, cy - r * .3, r * .7]], cx, cy, r, [.2, .24, 1.2, 1.3],
      (x, y) => (x - cx + .3 * r) ** 2 + (y - cy + .3 * r) ** 2 < (.34 * r) ** 2)
  }
  const jobs = [...TREES.map(s => ({ s: s as Spot, paint: tree })), ...BUSHES.map(s => ({ s: s as Spot, paint: bush }))]
  for (const j of jobs.sort((a, b) => a.s.y - b.s.y)) j.paint(j.s)
  for (const k of mask) {
    if (mask.has(k - 1) && mask.has(k + 1) && mask.has(k - W) && mask.has(k + W)) continue
    p.set(k % W, k / W | 0, C.deep)
  }
  return p.done()
})
