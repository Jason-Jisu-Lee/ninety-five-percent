import { dither } from '../../core/dither'
import { fbm, vnoise } from '../../core/noise'
import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'
import { W } from '../../data/screen'
import { ROOT, TRUNK } from '../../data/stage1'
import { stroke } from './stroke'

const { x: tx, y: ty, r } = TRUNK

export function clear(p: { x: number; y: number }, pad: number) {
  const d = Math.hypot(p.x - tx, p.y - ty), k = (r + pad) / d
  if (k <= 1) return
  p.x = tx + (p.x - tx) * k
  p.y = ty + (p.y - ty) * k
}

export function trunk(p: Pixels) {
  const edge = (x: number, y: number) => r - Math.hypot(x - tx, y - ty) + Math.sin(Math.atan2(y - ty, x - tx) * 70) * 1.2
  const each = (f: (x: number, y: number, e: number) => string | false) => {
    for (let y = 0; y < r + ty + 34; y++) for (let x = Math.floor(tx - r - 34); x < W; x++) {
      const col = f(x, y, edge(x, y))
      if (col) p.set(x, y, col)
    }
  }
  const taper = (u: number) => ROOT.half * (1 - u) ** .8 + 1.5
  each((x, y, e) => e < 0 && e > -30 && dither(x, y, (1 + e / 30) * .75) && (e > -7 ? C.t2 : C.t1))
  stroke(p, ROOT.x + 5, ROOT.y + 7, ROOT.ang, ROOT.len, ROOT.bend, taper, (_s, _u, x, y) => dither(x, y, .5) && C.g0)
  stroke(p, ROOT.x, ROOT.y, ROOT.ang, ROOT.len, ROOT.bend, taper, (s, u) => s > .45 ? C.t2 : s < -.5 ? C.t0 : Math.abs(s * 3 + Math.sin(u * 9)) % 1 < .18 ? C.t2 : C.t1)
  each((x, y, e) => {
    const n = fbm((x + vnoise(y / 26, 0, 7) * 16) / 8, y / 60, 11)
    return e >= 0 && (e < 3 || n < .4 ? C.t2 : n > .6 ? C.t0 : C.t1)
  })
}
