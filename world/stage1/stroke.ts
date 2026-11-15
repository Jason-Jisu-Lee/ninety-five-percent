import type { Pixels } from '../../core/pixels'

export function stroke(p: Pixels, x0: number, y0: number, ang: number, len: number, bend: number, half: (u: number) => number, ink: (s: number, u: number, x: number, y: number) => string | false) {
  const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx, dark = nx * .6 + ny * .8 < 0 ? -1 : 1
  for (let i = 0; i <= len * 2; i++) {
    const u = i / (len * 2), cx = x0 + dx * len * u + nx * bend * u * u, cy = y0 + dy * len * u + ny * bend * u * u, hw = half(u)
    for (let y = Math.floor(cy - hw); y <= cy + hw; y++) for (let x = Math.floor(cx - hw); x <= cx + hw; x++) {
      const ox = x + .5 - cx, oy = y + .5 - cy
      if (ox * ox + oy * oy > hw * hw) continue
      const col = ink((ox * nx + oy * ny) * dark / hw, u, x, y)
      if (col) p.set(x, y, col)
    }
  }
}
