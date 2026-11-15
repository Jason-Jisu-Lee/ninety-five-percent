import { dither } from '../../core/dither'
import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'
import { TWIG } from '../../data/stage1/scene'
import { stroke } from './stroke'

export function twig(p: Pixels) {
  const { x, y, ang, len, bend } = TWIG, dx = Math.cos(ang), dy = Math.sin(ang), u = .42
  const sx = x + dx * len * u - dy * bend * u * u, sy = y + dy * len * u + dx * bend * u * u
  const half = (v: number) => 2.4 - .9 * v, stub = (v: number) => 1.5 - .45 * v
  const bark = (s: number, v: number) => s > .4 ? C.t2 : s < -.4 ? C.t0 : v * len % 12 < 1.1 ? C.t2 : C.t1
  const dark = (_s: number, _v: number, px: number, py: number) => dither(px, py, .5) && C.g0
  stroke(p, x + 2, y + 3, ang, len, bend, half, dark)
  stroke(p, sx + 2, sy + 3, ang - .95, 20, -3.6, stub, dark)
  stroke(p, sx, sy, ang - .95, 20, -3.6, stub, bark)
  stroke(p, x, y, ang, len, bend, half, bark)
}
