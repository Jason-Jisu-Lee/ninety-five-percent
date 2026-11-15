import { pixels } from '../../../core/draw/pixels'
import { u32 } from '../../../core/screen/canvas'

export type Pt = number[]
export type Place = (x: number, y: number, z?: number) => Pt

export const mix = (a: Pt, b: Pt, t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
export const gap = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1])

export function raster(S: number) {
  const p = pixels(S, S), body = new Uint8Array(S * S), cover = new Uint8Array(S * S)
  const put = ([x, y]: Pt, hex: string, bit: number, solid = 0) => {
    const ix = Math.floor(x), iy = Math.floor(y), i = iy * S + ix
    if (ix < 0 || iy < 0 || ix >= S || iy >= S) return
    p.u[i] = u32(hex)
    cover[i] |= bit
    body[i] = solid
  }
  const line = (pts: Pt[], hex: string, bit: number) => {
    for (let k = 0; k < pts.length - 1; k++) {
      const n = Math.ceil(gap(pts[k], pts[k + 1]) * 2) || 1
      for (let j = 0; j <= n; j++) put(mix(pts[k], pts[k + 1], j / n), hex, bit)
    }
  }
  return { S, p, body, cover, put, line }
}

export type Raster = ReturnType<typeof raster>
