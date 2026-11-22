import type { Pen } from './pen'

type Rand = () => number
type Wet = (x: number, y: number) => boolean

export function stone(p: Pen, x: number, y: number, rx: number, ry: number, R: Rand) {
  const { stone: c, water } = p.L, a = R() * 6.283, b = R() * 6.283, moss = R() < .4 && rx > 9
  const rim = (nx: number, ny: number) => Math.hypot(nx, ny) / (1 + .05 * Math.sin(2 * Math.atan2(ny, nx) + a) + .03 * Math.sin(3 * Math.atan2(ny, nx) + b))
  p.shade(x, y, rx, ry, (nx, ny) => rim(nx, ny) <= 1)
  p.blob(x, y + 1, rx + 2, ry + 2, (nx, ny, px, py) => ny > .1 && rim(nx * (rx + 2) / rx, (ny * (ry + 2) + 1) / ry) > 1 && rim(nx * (rx + 2) / (rx + 1.4), (ny * (ry + 2) + 1) / (ry + 1.4)) <= 1 && p.is(px, py, water) && water[3])
  p.shape(() => p.blob(x, y, rx, ry, (nx, ny) => {
    const rr = rim(nx, ny), lit = -(nx + ny) / 1.414
    if (rr > 1) return false
    if (moss && rr > 1 - 2.4 / rx && lit > .72 * rr && Math.abs(nx - ny + .3) > .14) return p.L.moss
    if (rr > 1 - 2.2 / rx && lit < .1) return c[0]
    if (Math.hypot(nx + .36, ny + .4) < .2 && rx > 6) return c[3]
    return lit > .22 && rr < .86 ? c[2] : c[1]
  }))
}

export function pebble(p: Pen, x: number, y: number, r: number) {
  const c = p.L.stone
  p.shade(x - 1, y - 2, r, r * .7)
  p.blob(x, y, r, Math.max(1.45, r * .72), (nx, ny) => nx * nx + ny * ny <= 1 && c[nx + ny > .5 ? 0 : nx + ny < -.55 ? 2 : 1])
}

export function branch(p: Pen, x: number, y: number, len: number, ang: number, R: Rand, wet: Wet) {
  const c = p.L.wood, bend = (R() - .5) * len * .16, side = R() < .5 ? 1 : -1, c0 = Math.cos(ang), s0 = Math.sin(ang)
  const at = (t: number) => [x + c0 * len * t - s0 * bend * t * t, y + s0 * len * t + c0 * bend * t * t], [fx, fy] = at(.2 + R() * .15)
  let dip = 1
  for (let i = 0; i < len && dip === 1; i++) if (wet(at(i / len)[0], at(i / len)[1])) dip = Math.min(.88, i / len + .5)
  for (let i = 0; i <= len * dip; i++) for (const k of [0, 1]) p.dim(at(i / len)[0] + p.L.cast[0] + k, at(i / len)[1] + p.L.cast[1])
  for (let i = len * dip; i <= Math.min(len, len * dip + 6); i++) for (const k of [0, 1]) p.lift(at(i / len)[0], at(i / len)[1] + k)
  p.shape(() => {
    p.curve(fx, fy, len * .22, ang + side * .6, side * 3, t => 2.4 - t * 1.4, (_t, s) => c[s > .6 ? 0 : 1])
    p.curve(x, y, len * dip, ang, bend * dip * dip, t => 4.6 - t * 2.2, (_t, s) => s < .34 ? c[2] : s > .7 ? c[0] : c[1])
  })
  const [ex, ey] = at(dip)
  if (dip < 1) for (const [dx, dy] of [[-3, 2], [-2, 3], [2, 3], [3, 2]]) if (wet(ex + dx, ey + dy)) p.dot(ex + dx, ey + dy, p.L.water[3])
}

export function sunken(p: Pen, x: number, y: number, len: number, ang: number) {
  const { water, abyss } = p.L, c = Math.cos(ang), s = Math.sin(ang), bow = 1 + len / 60, deep = [water[0], water[1]]
  const mark = (qx: number, qy: number, col: string) => p.is(qx, qy, deep) && p.dot(qx, qy, col)
  for (let j = 1; j < 9; j++) for (const k of [0, 1]) mark(x + c * len * .4 + j + k, y + s * len * .4 - j, abyss)
  for (let i = 0; i <= len; i++) {
    const t = i / len, cut = i < 1 || i > len - 1 ? 1 : 0, thick = Math.round(6 - 2 * t), lit = !cut && Math.sin(t * 16 + len) > -.55
    for (let k = cut; k < thick - cut; k++) mark(x + c * i, y + s * i - bow * Math.sin(Math.PI * t) + k, k < 2 && lit ? water[1] : abyss)
  }
}

export function ring(p: Pen, x: number, y: number) {
  for (let k = 0; k < 6; k++) p.lift(x + k - 3, y + (k % 5 ? 0 : 1))
}