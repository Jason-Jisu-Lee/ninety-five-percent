import { dither } from '../../../core/draw/dither'
import { fbm, vnoise } from '../../../core/math/noise'
import type { Pixels } from '../../../core/draw/pixels'
import { FOREST as C } from '../../../data/look/palette'
import { W } from '../../../data/look/screen'
import { onLog, stub, type Log } from '../../../data/stage1/map'
import { stroke } from './stroke'

const girth = (L: Log, u: number) => L.r * (1 - L.taper * u / L.len)
const bark = (s: number, v: number) => s > .4 ? C.t2 : s < -.4 ? C.t0 : v % .34 < .05 ? C.t2 : C.t1

function each(p: Pixels, L: Log, pad: number, ink: (x: number, y: number, u: number, v: number, r: number) => string | false) {
  const ca = Math.cos(L.ang), sa = Math.sin(L.ang)
  for (let y = Math.floor(L.y - L.r); y < L.y + sa * L.len + L.r + pad; y++) for (let x = Math.floor(L.x - L.r); x < Math.min(W, L.x + ca * L.len + L.r); x++) {
    const u = (x - L.x) * ca + (y - L.y) * sa, v = -(x - L.x) * sa + (y - L.y) * ca, col = u <= L.len && ink(x, y, u, v, girth(L, u))
    if (col) p.set(x, y, col)
  }
}

export function logShade(p: Pixels, L: Log) {
  const k = L.r / 16
  each(p, L, 12 * k, (x, y, u, v, r) => u > -4 * k && v > r - 2 && v < r + 10 * k && dither(x + 6, y, v < r + 5 * k ? .5 : .25) && C.g0)
}

export function log(p: Pixels, L: Log) {
  const k = L.r / 16, hole = L.r * .44, ca = Math.cos(L.ang), sa = Math.sin(L.ang), arm = (u: number) => (3.6 - u) * k
  for (const s of L.stubs.filter(s => s[1] < 0)) {
    const [x, y, a, len] = stub(L, s)
    stroke(p, x, y, a, len, 2 * k, arm, bark)
  }
  each(p, L, 0, (x, y, u, v, r) => {
    const s = v / r, grain = vnoise(u / 11 / k, v / 2.4 / k, 11), moss = fbm(x / 24 / k, y / 24 / k, 31) + (s < -.2 ? .05 : 0)
    if (u < 0 || Math.abs(s) > 1) return false
    if (s < .2 && moss > .58) return moss > .66 && dither(x, y, .5) ? C.g3 : moss > .61 || dither(x, y, .5) ? C.g2 : C.cDark
    if (s > .55 || s > .3 && dither(x, y, (s - .3) * 2.4)) return C.t2
    if (s < -.66 || s < -.42 && dither(x, y, (-.42 - s) * 2.5)) return C.t0
    return grain > .64 ? C.t2 : grain < .2 ? C.t0 : C.t1
  })
  p.oval(L.x, L.y, hole, L.r, (x, y) => {
    const d = ((x - L.x) * ca + (y - L.y) * sa) ** 2 / hole ** 2 + (-(x - L.x) * sa + (y - L.y) * ca) ** 2 / L.r ** 2
    return d > 1 ? false : d > .74 ? C.t0 : d < .2 ? C.t2 : (d * 9 | 0) & 1 ? C.seed : C.husk
  })
  for (const u of L.fungi) {
    const [x, y] = onLog(L, u, girth(L, u) - 1)
    p.oval(x, y + 1, 5 * k, 3 * k, (_x, py, d) => py < y ? false : d > .55 ? C.husk : C.white)
  }
  for (const s of L.stubs) {
    const [x, y, a, len, tx, ty] = stub(L, s)
    if (s[1] > 0) stroke(p, x, y, a, len, 2 * k, arm, bark)
    p.oval(tx, ty, 2.6 * k, 2.6 * k, (_x, _y, d) => d < .3 ? C.seed : C.husk)
  }
}
