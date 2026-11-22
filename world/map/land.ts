import { clamp } from '../../core/math/clamp'
import { fbm, vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import { CX, CY, LAND as L, MH, MW } from '../../data/map/plan'

export type Rand = () => number
export type Blob = { x: number; y: number; rx: number; ry: number; rot: number; cos: number; sin: number; seed: number }
export type Tree = { x: number; y: number; r: number; roots: number[][] }
export type Trunk = { x: number; y: number; ang: number; len: number; r: number; taper: number; stubs: number[][]; fungi: number[] }

export const pick = (R: Rand, [a, b]: number[]) => a + R() * (b - a)
const rho = (b: Blob, x: number, y: number) => {
  const dx = x - b.x, dy = y - b.y
  return Math.hypot((dx * b.cos + dy * b.sin) / b.rx, (dy * b.cos - dx * b.sin) / b.ry)
}
const blob = (R: Rand, r: number[], squash: number[]): Blob => {
  const rx = pick(R, r), rot = R() * Math.PI
  return { x: CX, y: CY, rx, ry: rx * pick(R, squash), rot, cos: Math.cos(rot), sin: Math.sin(rot), seed: R() * 9999 | 0 }
}
const seen = (f: (x: number, y: number) => number) => {
  let n = 0
  for (let j = 0; j < 18; j++) for (let i = 0; i < 32; i++) n += +(f(CX + (i - 15.5) * W / 32, CY + (j - 8.5) * H / 18) > 0)
  return n / 576
}
const slide = (b: Blob, ang: number, far: number) => Object.assign(b, { x: CX + Math.cos(ang) * far, y: CY + Math.sin(ang) * far })
const reach = (b: Blob, ang: number, share: number, f: (x: number, y: number) => number) => {
  let lo = 0, hi = b.rx + 420
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2
    slide(b, ang, mid)
    if (seen(f) > share) lo = mid
    else hi = mid
  }
}
export const off = (t: Trunk, x: number, y: number) => {
  const c = Math.cos(t.ang), s = Math.sin(t.ang), u = clamp(((x - t.x) * c + (y - t.y) * s) / t.len) * t.len
  return Math.hypot(x - t.x - c * u, y - t.y - s * u) - t.r
}

export function land(R: Rand) {
  const turn = R() * 6.283, at = (i: number) => turn + i * 1.571 + (R() - .5) * .7
  const pond = blob(R, L.pond.r, L.pond.squash), meadow = blob(R, L.meadow.r, L.meadow.squash), rocks = blob(R, L.rocks.r, L.rocks.squash)
  const flip = R() < .5 ? 1 : 3, aPond = at(0), aMeadow = at(2), aRocks = at(flip), aWood = at(4 - flip)
  const brook: number[][] = [], wide = pick(R, L.stream.wide)
  const stir = (x: number, y: number) => (fbm(x / L.pond.lobes, y / L.pond.lobes, pond.seed) - .5) * pond.ry * .55
  const rip = (x: number, y: number) => (fbm(x / L.pond.wiggle, y / L.pond.wiggle, pond.seed + 7) - .5) * 44
  const lake = (x: number, y: number, a = stir(x, y), b = rip(x, y), base = (1 - rho(pond, x, y)) * pond.ry + a) => base + b * clamp(1 - base / 50)
  const far = (x: number, y: number) => {
    let near = 9999
    for (let i = 1; i < brook.length; i++) {
      const [ax, ay] = brook[i - 1], [bx, by] = brook[i], t = clamp(((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2))
      near = Math.min(near, Math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay)))
    }
    return near
  }
  const wet = (x: number, y: number, a = stir(x, y), b = rip(x, y), d = far(x, y)) => Math.max(lake(x, y, a, b), d > wide + 30 ? wide - d : wide - d + (vnoise(x / 26, y / 26, 5) - .5) * 9)
  const sun = (x: number, y: number) => clamp((1 - rho(meadow, x, y)) * 2.6 + (fbm(x / 150, y / 150, meadow.seed) - .5) * 1.5)
  const bare = (x: number, y: number) => clamp((1 - rho(rocks, x, y)) * 3 + (fbm(x / 60, y / 60, rocks.seed) - .5) * 1.3)
  reach(pond, aPond, pick(R, L.pond.share), (x, y) => lake(x, y))
  reach(meadow, aMeadow, pick(R, L.meadow.share), (x, y) => sun(x, y) - .5)
  slide(rocks, aRocks, pick(R, L.rocks.far))
  for (let x = pond.x, y = pond.y, a = aPond + (R() - .5), i = 0; i < 40 && x > -200 && y > -200 && x < MW + 200 && y < MH + 200; i++) {
    brook.push([x, y])
    a += (R() - .5) * 2 * L.stream.bend
    x += Math.cos(a) * L.stream.step
    y += Math.sin(a) * L.stream.step
  }
  const fallen = (len: number[], r: number[], far: number[], stubs: number, ok: (x: number, y: number, t: Trunk) => boolean): Trunk => {
    for (let i = 0; ; i++) {
      const d = pick(R, far), a = aWood + (R() - .5) * (1 + i * .1), ang = (R() - .5) * 2.2, back = R() * .6
      const t: Trunk = { x: CX + Math.cos(a) * d, y: CY + Math.sin(a) * d, ang, len: pick(R, len), r: pick(R, r), taper: .14 + R() * .1, stubs: [], fungi: [] }
      t.x -= Math.cos(ang) * t.len * back
      t.y -= Math.sin(ang) * t.len * back
      for (let k = 0; k < stubs; k++) t.stubs.push([t.len * (.2 + .6 * (k + R() * .7) / stubs), k & 1 ? 1 : -1, (k & 1 ? 1 : -1) * (1.1 + R() * .7), t.r * (.7 + R() * .4)])
      for (let k = 0; k < stubs + 1; k++) t.fungi.push(t.len * (.15 + R() * .7))
      if (i > 60 || [0, .25, .5, .75, 1].every(u => ok(t.x + Math.cos(ang) * t.len * u, t.y + Math.sin(ang) * t.len * u, t))) return t
    }
  }
  const trunk = fallen(L.trunk.len, L.trunk.r, L.trunk.far, 4, (x, y, t) => wet(x, y) < -t.r - 14)
  const log = fallen(L.log.len, L.log.r, L.log.far, 2, (x, y, t) => wet(x, y) < -t.r - 14 && off(trunk, x, y) > t.r + 30 && Math.abs(t.x + Math.cos(t.ang) * t.len / 2 - CX) < W * .4 && Math.abs(t.y + Math.sin(t.ang) * t.len / 2 - CY) < H * .38)
  const trees: Tree[] = [], T = L.trees, side = R() < .5 ? -1 : 1
  const root = (x: number, y: number, r: number, n = 8 + (R() * 4 | 0)): Tree => ({ x, y, r, roots: Array.from({ length: n }, (_, i) => [(i + R() * .7) / n * 6.283, r * (.2 + R() * R() * .95), (R() - .5) * .8]) })
  const free = (x: number, y: number, r: number) => wet(x, y) < -r - 40 && sun(x, y) < .3 && bare(x, y) < .2 && off(trunk, x, y) > r + 50 && off(log, x, y) > r + 30 && trees.every(t => Math.hypot(t.x - x, t.y - y) > T.gap)
  for (let i = 0; i < 40 && !trees.length; i++) {
    const r = pick(R, T.r), x = CX + side * (W / 2 + r + 8 + R() * 50) * (i < 20 ? 1 : -1), y = CY + (R() - .5) * 250
    if (free(x, y, r)) trees.push(root(x, y, r))
  }
  for (let i = 0; i < 600 && trees.length < T.n; i++) {
    const r = pick(R, T.r), x = -60 + R() * (MW + 120), y = -60 + R() * (MH + 120)
    if (Math.hypot((x - CX) / 1.5, y - CY) > T.clear && free(x, y, r)) trees.push(root(x, y, r))
  }
  const shade = (x: number, y: number) => {
    let s = .22
    for (const t of trees) s += Math.max(0, 1 - Math.hypot(t.x - x, t.y - y) / (t.r * T.reach)) ** 1.5 * 1.5
    return clamp(s * (.55 + .9 * fbm(x / 70, y / 70, 77)) - sun(x, y) * .7)
  }
  return { pond, meadow, rocks, brook, wide, trunk, log, trees, wet, sun, bare, shade, lake, stir, rip, far }
}

export type Land = ReturnType<typeof land>
