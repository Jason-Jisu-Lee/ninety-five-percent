import { wrap } from '../../core/math/angle'
import type { Pen } from './pen'

type Rand = () => number
type Ink = (t: number, side: number, m: number) => string

export function pad(p: Pen, x: number, y: number, r: number, turn: number, R: Rand) {
  const { pad: c, water } = p.L, ry = r * .82, big = r >= 11, n = 7 + (r / 5 | 0), veins = Array.from({ length: n }, (_, i) => turn + .5 + (i + R() * .5) / n * 5.3)
  const leaf = (nx: number, ny: number) => nx * nx + ny * ny <= 1 && !(Math.abs(wrap(Math.atan2(ny, nx) - turn)) < .26 && nx * nx + ny * ny > .02)
  p.shade(x + 1, y + 1, r, ry, leaf)
  p.shape(() => p.blob(x, y, r, ry, (nx, ny) => {
    if (!leaf(nx, ny)) return false
    const rr = Math.hypot(nx, ny), a = Math.atan2(ny, nx), lit = Math.hypot(nx + .3, ny + .32) < .78, vein = big && rr > .12 && rr < .9 && veins.some(v => Math.abs(wrap(a - v)) < .55 / (rr * r))
    if (rr > 1 - 1.6 / r) return nx + ny > .15 ? c[0] : lit ? c[3] : c[2]
    if (big && rr < 2.2 / r) return c[0]
    return vein ? c[lit ? 1 : 0] : c[lit ? 2 : 1]
  }))
  for (let i = big ? R() * 3 | 0 : 0; i--;) p.dot(x + (R() - .6) * r, y + (R() - .6) * ry, water[4])
}

export function lily(p: Pen, x: number, y: number, r: number, R: Rand) {
  const { white, pink, yellow, head } = p.L, turn = R() * 6.283
  p.shade(x, y, r, r * .85)
  p.shape(() => p.blob(x, y, r, r * .88, (nx, ny) => {
    const rr = Math.hypot(nx, ny), a = Math.atan2(ny, nx) + turn, outer = Math.abs(Math.cos(a * 4)), inner = Math.abs(Math.cos(a * 3 + 1))
    if (rr < .2) return (nx + ny) * r % 2 < 1 ? yellow : head[2]
    if (rr < .3 + .28 * inner) return inner < .28 ? pink : white
    if (rr > .52 + .48 * outer ** .7) return false
    return outer < .3 || rr > .8 ? pink : white
  }))
}

function blade(p: Pen, x: number, y: number, tall: number, lean: number, bend: number, wide: number, ink: Ink) {
  for (let i = 0, last = x; i <= tall; i++) {
    const t = i / tall, cx = x + lean * i + bend * t * t, half = wide * (t < .12 ? .55 + t * 3.75 : (1 - t) ** .6) / 2, a = Math.round(Math.min(cx, last) - half), b = Math.round(Math.max(cx, last) + half)
    for (let px = a; px <= b; px++) p.dot(px, y - i, ink(t, b > a ? (px - a) / (b - a) : .5, b - a + 1))
    last = cx
  }
}

export function stand(p: Pen, x: number, y: number, rx: number, ry: number, n: number, R: Rand, wet: (x: number, y: number) => boolean) {
  const { plant: c, head, dry } = p.L, [sx, sy] = p.L.cast, cats = R() * 5 | 0, strays = 2 + (R() * 3 | 0)
  const stems = Array.from({ length: n + strays }, (_, i) => {
    const far = i >= n, side = R() < .5 ? -1 : 1
    return { x: Math.round(x + (far ? side * (rx + 6 + R() * 9) : (R() + R() + R() - 1.5) / 1.5 * rx)), y: Math.round(y + (R() + R() - 1) * ry), cat: i < cats, far, side }
  }).filter(s => wet(s.x, s.y)).sort((a, b) => +a.cat - +b.cat || a.y - b.y)
  p.shade(x, y + 2, rx * .9, ry * .9, (nx, ny) => nx * nx + ny * ny <= 1 && wet(x + sx + nx * rx * .9, y + 2 + sy + ny * ry * .9))
  for (const s of stems) for (let i = 2, m = s.far ? 6 : 14; i < m; i++) for (const k of [0, 1]) p.dim(s.x + k + i * sx / 3, s.y + i * sy / 3)
  p.shape(() => stems.forEach(s => {
    const out = (s.x - x) / rx, near = s.y > y, body = c[near ? 2 : 1], edge = c[near ? 1 : 0]
    if (s.far) return blade(p, s.x, s.y, 8 + R() * 12, s.side * (.18 + R() * .29), 0, 2.6 + R() * .6, (_t, side, m) => m > 1 && side > .6 ? edge : body)
    if (!s.cat) return blade(p, s.x, s.y, 44 + R() * 50, out * .2 + (R() - .5) * .1, out * (5 + R() * 13) + (R() - .5) * 8, 4 + R() * 2.4,
      (t, side, m) => t < .06 ? c[0] : t > .94 && near ? c[3] : m > 2 && side > .7 ? edge : near && m > 2 && side < .2 && t > .3 ? c[3] : body)
    const tall = 70 + R() * 40, lean = out * .08 + (R() - .5) * .06, h0 = Math.round(tall * .6), h1 = h0 + 22 + (R() * 10 | 0)
    blade(p, s.x, s.y, tall, lean, 0, 3, (t, side, m) => t > .9 ? dry : t < .06 ? c[0] : m > 1 && side > .6 ? c[0] : c[1])
    for (let j = h0; j <= h1; j++) {
      const hx = Math.round(s.x + lean * j), tip = j < h0 + 2 || j > h1 - 2, half = tip ? 2 : 3
      for (let k = -half; k <= half; k++) p.dot(hx + k, s.y - j, head[k === -half || k > 1 || j === h0 ? 0 : k === -half + 1 && !tip ? 2 : 1])
    }
  }))
  for (const s of stems.filter(s => !s.far).slice(-5)) for (let k = -2; k < 3; k++) if (wet(s.x + k * 2, s.y + 2)) p.lift(s.x + k + (s.x > x ? 3 : -3), s.y + 2)
}
export function tuft(p: Pen, x: number, y: number, r: number, kind: number, R: Rand) {
  const c = p.L.plant, n = [3, 4, 5, 6][kind], open = [.5, .8, 1.1, 1.4][kind]
  for (let i = -(r * .3 | 0); i <= r * .3; i++) p.dim(x + i + 2, y + 1)
  for (let i = 0; i < n; i++) {
    const out = ((i + R() * .6) / (n - .4) - .5) * 2, mid = Math.abs(out) < .4
    blade(p, x + Math.round(out * 2), y, r * (mid ? 1 : .55 + R() * .3), out * open * .5, out * open * r * .25, 2 + R() * 1.4, (t, side, m) => t < .12 ? c[0] : t > .8 ? c[3] : m > 1 && side > .6 ? c[1] : c[2])
  }
}

export function clover(p: Pen, x: number, y: number, n: number, R: Rand) {
  const c = p.L.pad, turn = R() * 6.283
  for (let k = -3; k < 6; k++) p.dim(x + k, y + 4)
  p.blob(x, y, 5.5, 3.5, (nx, ny) => nx * nx + ny * ny <= 1 && c[1])
  for (let i = 0; i < n; i++) {
    const lx = Math.round(x + Math.cos(turn + i * 2.4) * Math.sqrt(i) * 1.9), ly = Math.round(y + Math.sin(turn + i * 2.4) * Math.sqrt(i) * 1.4)
    for (const [dx, dy] of [[0, -1], [-1, 0], [0, 0], [1, 0]]) p.dot(lx + dx, ly + dy, c[dy && i % 2 ? 3 : 2])
  }
}
export function bloom(p: Pen, x: number, y: number, r: number, gold: boolean, R: Rand) {
  const { daisy, yellow, head, plant } = p.L, turn = R() * 6.283, n = gold ? 5 : 8
  for (let i = -1; i < 3; i++) p.dim(x + i + 2, y + 3)
  p.curve(x, y + 1, r * 1.2, 1.2 + R() * .8, 2, () => 2, (_t, s) => plant[s < .5 ? 2 : 1])
  p.blob(x, y, r, r * .9, (nx, ny) => {
    const rr = Math.hypot(nx, ny), petal = Math.abs(Math.cos((Math.atan2(ny, nx) + turn) * n / 2))
    if (rr < .3) return gold ? head[2] : yellow
    return rr < .5 + .5 * petal ** .6 && (gold ? petal < .2 && rr < .62 ? head[2] : p.L.gold : (petal >= .22 || rr < .45) && daisy)
  })
}
