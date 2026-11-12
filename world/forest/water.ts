import { dither } from '../../core/dither'
import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'
import { H, W } from '../../data/screen'
import { river } from './river'

export function water(p: Pixels, free: Uint8Array) {
  const { edge, E } = river()
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const e = edge[y * W + x]
    if (e >= 6 || e >= 4 && !dither(x, y, .5)) continue
    const open = e < -2 && E(x, y - 3) < 0
    if (open) free[y * W + x] = 1
    p.set(x, y, e >= 2 ? C.t1 : e >= 0 ? C.t2 : E(x, y - 3) >= 0 ? C.w3 : e >= -2 ? C.wSh
      : e < -13 && dither(x, y, Math.min(1, (-13 - e) / 7)) ? C.w2 : C.w1)
  }
}
