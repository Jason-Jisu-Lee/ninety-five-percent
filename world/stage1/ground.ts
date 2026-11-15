import { dither } from '../../core/dither'
import { fbm } from '../../core/noise'
import { once } from '../../core/once'
import { pixels } from '../../core/pixels'
import { rng } from '../../core/rng'
import { FOREST as C } from '../../data/palette'
import { H, W } from '../../data/screen'
import { CLOVER, CLUMPS, DAISIES, DANDELION, LEAF, PEBBLES } from '../../data/stage1'
import { clover, daisy, dandelion } from './flora'
import { clump } from './grass'
import { leaf, pebble } from './litter'
import { pond } from './pond'
import { trunk } from './trunk'

export const ground = once(() => {
  const p = pixels(W, H), R = rng(2026), byY = (a: number[], b: number[]) => a[1] - b[1]
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const nl = fbm(x / 110, y / 110, 5), nd = fbm(x / 90 + 40, y / 90, 9)
    p.set(x, y, nl > .56 ? (dither(x, y, Math.min(.5, (nl - .56) * 5)) ? C.g2 : C.g1)
      : nd > .57 && dither(x, y, Math.min(.5, (nd - .57) * 5)) ? C.g0 : C.g1)
  }
  pond(p)
  trunk(p)
  for (const [x, y, n] of CLOVER) clover(p, x, y, R, n)
  leaf(p, LEAF.x, LEAF.y, LEAF.ang, LEAF.len)
  for (const [x, y, rx, ry] of [...PEBBLES].sort(byY)) pebble(p, x, y, rx, ry)
  for (const [x, y, a, b] of [...CLUMPS, ...DAISIES, DANDELION].sort(byY))
    b ? clump(p, x, y, R, a, b) : a ? daisy(p, x, y, a) : dandelion(p, x, y, R)
  return p.done()
})
