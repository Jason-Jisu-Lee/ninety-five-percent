import { dither } from '../../core/draw/dither'
import type { Pixels } from '../../core/draw/pixels'
import { clamp } from '../../core/math/clamp'
import { fbm, vnoise } from '../../core/math/noise'
import { FOREST as C } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { water } from '../stage1/scenery/pond'
import type { World } from './make'

const G = 4, GW = W / G + 1, GH = H / G + 1

export function soil(m: World, p: Pixels, x0: number, y0: number, s: number) {
  const k = 1 / s, f = Array.from({ length: 8 }, () => new Float32Array(GW * GH)), deep = new Float32Array(W * H)
  let i = 0, fx = 0, fy = 0
  const at = (a: Float32Array) => {
    const top = a[i] + (a[i + 1] - a[i]) * fx, low = a[i + GW] + (a[i + GW + 1] - a[i + GW]) * fx
    return top + (low - top) * fy
  }
  for (let j = 0; j < GH; j++) for (let g = 0; g < GW; g++, i++) {
    const x = x0 + g * G * s, y = y0 + j * G * s
    f[0][i] = m.stir(x, y)
    f[1][i] = m.far(x, y)
    f[2][i] = m.sun(x, y)
    f[3][i] = m.shade(x, y)
    f[4][i] = m.bare(x, y)
    f[5][i] = fbm(x / 110, y / 110, 5)
    f[6][i] = fbm(x / 90 + 40, y / 90, 9)
    f[7][i] = m.rip(x, y)
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    i = (y >> 2) * GW + (x >> 2)
    fx = ((x & 3) + .5) / G
    fy = ((y & 3) + .5) / G
    const reach = at(f[1]), d = m.wet(x0 + (x + .5) * s, y0 + (y + .5) * s, at(f[0]), at(f[7]), reach > m.wide + 44 ? reach : undefined)
    deep[y * W + x] = d * k
    if (d > 3) continue
    const sun = at(f[2]), dark = at(f[3]), bare = at(f[4]), grit = vnoise(x / 1.7, y / 1.7, 41), nl = at(f[5]) + sun * .2 - dark * .16, nd = at(f[6]) + dark * .28 - sun * .2
    let col = nl > .56 ? dither(x, y, Math.min(.5, (nl - .56) * 5)) ? C.g2 : C.g1 : nd > .57 && dither(x, y, Math.min(.5, (nd - .57) * 5)) ? C.g0 : C.g1
    if (nl > .7 && dither(x, y, Math.min(.5, (nl - .7) * 4))) col = C.g3
    if (nd > .76 && dither(x + 2, y + 1, Math.min(.5, (nd - .76) * 4))) col = C.deep
    if (dark > .3 && grit > .985 - dark * .05) col = grit > .99 ? C.seed : C.t1
    if (d > -30 && d < -8 && dither(x + 1, y, .3)) col = C.cMid
    if (bare > .5 || bare > .28 && dither(x, y, (bare - .28) * 4.5)) col = grit > .86 ? C.r1 : grit < .1 ? C.t2 : grit > .68 && bare > .6 ? C.t0 : C.t1
    p.set(x, y, col)
  }
  const depth = (x: number, y: number) => deep[clamp(Math.round(y), 0, H - 1) * W + clamp(Math.round(x), 0, W - 1)], r = Math.max(2, Math.round(14 * k))
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const d = deep[y * W + x]
    if (d < 0 && d > -9 * k && depth(x - r, y) > 0 && depth(x + r, y) > 0 && depth(x, y - r) > 0 && depth(x, y + r) > 0) deep[y * W + x] = 3 * k
  }
  water(p, depth, k, 0, 0, W, H)
  return depth
}
