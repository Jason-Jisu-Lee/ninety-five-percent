import { ctx, mk } from '../../core/canvas'
import { LX, LY } from './leaf'

export const EX = 240, EY = 134
const A = Math.atan2(LY, LX), C = Math.cos(A), S = Math.sin(A), RX = 10, RY = 6
const cache: HTMLCanvasElement[] = []

export function egg(bright: boolean) {
  return cache[+bright] ??= (() => {
    const c = mk(25, 25), g = ctx(c)
    const shell = (ox: number, fn: (dx: number, dy: number, e: number) => string) => {
      for (let dy = -12; dy <= 12; dy++) for (let dx = -12; dx <= 12; dx++) {
        const qx = dx - ox, qy = dy - ox, e = ((qx * C + qy * S) / RX) ** 2 + ((-qx * S + qy * C) / RY) ** 2
        if (e > 1) continue
        g.fillStyle = fn(dx, dy, e)
        g.fillRect(12 + dx, 12 + dy, 1, 1)
      }
    }
    shell(3, () => 'rgba(6,18,14,0.55)')
    shell(0, (dx, dy, e) => {
      const s = -(dx * .6 + dy * .8) / 8
      return e > .68 && s < 0 ? '#7d6c52' : e > .8 ? '#cfc4ae' : s > .5 && e < .55 ? '#fbf6ea'
        : s < -.25 ? (bright ? '#d2c6ac' : '#c4b69a') : bright ? '#ece5d5' : '#e6dcc7'
    })
    return c
  })()
}
