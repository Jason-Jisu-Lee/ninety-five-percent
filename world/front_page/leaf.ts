import { bayer } from '../../core/dither'
import type { Pixels } from '../../core/pixels'
import { H, W } from '../../data/screen'

const X0 = 30, Y0 = 219
export const LX = 420, LY = -168
const LL = Math.hypot(LX, LY), DX = LX / LL, DY = LY / LL

function leafAt(x: number, y: number) {
  const rx = x - X0, ry = y - Y0, t = (rx * DX + ry * DY) / LL
  if (t < 0 || t > 1) return null
  const d = rx * -DY + ry * DX, w = 13 * Math.pow(Math.sin(Math.PI * t), .55)
  return Math.abs(d) < w ? { t, d, w } : null
}

export function leaf(p: Pixels) {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (leafAt(x - 6, y - 5) && !leafAt(x, y)) p.dark(x, y, .6)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const f = leafAt(x, y)
    if (!f) continue
    const a = Math.abs(f.d), up = f.d < 0, lit = a / f.w * 1.4 + bayer(x, y) < .9
    const vein = ((Math.floor(f.t * LL - a * .9) % 13) + 13) % 13 === 0
    p.set(x, y, a < .75 ? '#1c4730' : a > f.w - 1.3 ? (up ? '#4f8a52' : '#143424')
      : vein ? (up ? '#285e3c' : '#143424')
      : up ? (lit ? '#3a7848' : '#285e3c') : lit ? '#285e3c' : '#1c4730')
  }
}
