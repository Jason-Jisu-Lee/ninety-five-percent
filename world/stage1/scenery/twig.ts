import { dither } from '../../../core/draw/dither'
import type { Pixels } from '../../../core/draw/pixels'
import { FOREST as C } from '../../../data/look/palette'
import { Z, type TWIGS } from '../../../data/stage1/map'
import { stroke } from './stroke'

export function twig(p: Pixels, { x, y, ang, len, bend }: (typeof TWIGS)[number]) {
  const dx = Math.cos(ang), dy = Math.sin(ang), u = .42, sx = x + dx * len * u - dy * bend * u * u, sy = y + dy * len * u + dx * bend * u * u
  const half = (v: number) => (2.4 - .9 * v) * Z, stub = (v: number) => (1.5 - .45 * v) * Z
  const bark = (s: number, v: number) => s > .4 ? C.t2 : s < -.4 ? C.t0 : v * len % 12 < 1.1 ? C.t2 : C.t1
  const dark = (_s: number, _v: number, px: number, py: number) => dither(px, py, .5) && C.g0
  stroke(p, x + 2, y + 3, ang, len, bend, half, dark)
  stroke(p, sx + 2, sy + 3, ang - .95, 20 * Z, -3.6 * Z, stub, dark)
  stroke(p, sx, sy, ang - .95, 20 * Z, -3.6 * Z, stub, bark)
  stroke(p, x, y, ang, len, bend, half, bark)
}
