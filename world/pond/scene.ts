import { wrap } from '../../core/math/angle'
import { clamp } from '../../core/math/clamp'
import { rng } from '../../core/math/rng'
import { H, W } from '../../data/look/screen'
import { LOOKS } from '../../data/pond/looks'
import { bloom, clover, lily, pad, stand, tuft } from './flora'
import { fields, ground, ticker } from './ground'
import { pen } from './pen'
import { branch, pebble, ring, stone, sunken } from './rocks'
import { shore } from './shore'

type Test = (x: number, y: number, d: number) => boolean
type Box = (x: number, y: number) => number[]

function build(seed: number, look: number) {
  const R = rng(seed), sd = shore(R), land = fields(R() * 9999 | 0), { beach, depth } = land, p = pen(LOOKS[look], W, H), tick = ticker(p)
  const wakes: number[][] = [], made: string[] = [], [cx, cy] = p.L.cast, wet = (x: number, y: number) => sd(x, y) > 0
  let id = 0
  const spot = (ok: Test, box?: Box) => {
    for (let i = 0; i < 300; i++) {
      const x = Math.round(14 + R() * (W - 28)), y = Math.round(20 + R() * (H - 34))
      if (ok(x, y, sd(x, y)) && (!box || p.clear(box(x, y), id))) return [x, y]
    }
  }
  const near = ([hx, hy]: number[], far: number, ok: Test, box: Box) => {
    for (let i = 0; i < 120; i++) {
      const x = Math.round(hx + (R() + R() - 1) * far), y = Math.round(hy + (R() + R() - 1) * far * .7)
      if (x > 8 && y > 14 && x < W - 8 && y < H - 6 && ok(x, y, sd(x, y)) && p.clear(box(x, y), id)) return [x, y]
    }
  }
  const around = (rx: number, ry = rx): Box => (x, y) => [x - rx, y - ry, x + rx, y + ry]
  const apart = (list: number[][], x: number, y: number, r: number) => list.every(([lx, ly, lr]) => Math.hypot(lx - x, ly - y) > lr + r)
  const grassy: Test = (x, y, d) => -d > beach(x, y) + 10
  const inland: Test = (_x, _y, d) => -d > 90
  const group = () => p.tag(++id)

  ground(p, sd, land, tick)
  p.hold([W / 2 - 30, H / 2 - 36, W / 2 + 30, H / 2 + 26])
  for (let i = 0; i < 5; i++) {
    const at = spot((x, y, d) => d > 5 && depth(x, y, d) < 22)
    if (at) p.shade(at[0] - cx, at[1] - cy, 2 + R() * 2.5, 1.5 + R() * 1.5)
  }
  group()
  const log = spot((x, y, d) => depth(x, y, d) > 125 && x > 50 && x < W - 110 && y > 30 && y < H - 30, (x, y) => [x - 2, y - 36, x + 96, y + 40])
  if (log) sunken(p, log[0], log[1], 56 + R() * 36, (R() - .5) * .7), wakes.push([log[0] + 40, log[1]]), made.push('log')
  for (let g = 0, n = 1 + (R() * 2 | 0); g < n; g++) {
    const rx = g ? 16 + R() * 12 : 30 + R() * 18, ry = rx / (1.7 + R() * 1.1), box: Box = (x, y) => [x - rx - 48, y - ry - 112, x + rx + 48, y + ry + 6]
    const base: Test = (x, y, d) => d > 9 && d < 20 && x > 50 && x < W - 50 && y > 70
    group()
    const home = spot((x, y, d) => base(x, y, d) && beach(x, y) < 8, box) ?? spot(base, box)
    if (!home) continue
    wakes.push(home)
    made.push('stand')
    stand(p, home[0], home[1], rx, ry, Math.round(rx * (.55 + R() * .25)), R, wet)
  }
  group()
  const rock = spot((x, y, d) => Math.abs(d + 2) < 7 && beach(x, y) > 7 && -d < beach(x, y) - 1, around(28, 22))
  if (rock) {
    const stones = [[...rock, 16 + R() * 8]], pebbles: number[][] = []
    for (let i = 0; i < 3; i++) {
      const r = 7 + R() * 7, at = near(rock, 46, (x, y, d) => d > -16 && d < 12 && -d < beach(x, y) && apart(stones, x, y, r - 3), around(r + 4))
      if (at) stones.push([...at, r])
    }
    for (let i = 0, n = 2 + (R() * 3 | 0); i < n; i++) {
      const r = 1.9 + R() * .7, at = near(rock, 40, (x, y, d) => d < -2 && -d < beach(x, y) - 2 && apart(stones, x, y, 3) && apart(pebbles, x, y, r + 2), around(4))
      if (at) pebbles.push([...at, r]), pebble(p, at[0], at[1], r)
    }
    for (const [x, y, r] of stones.sort((a, b) => a[1] - b[1])) stone(p, x, y, r, r * (.62 + R() * .12), R)
    wakes.push(rock)
    made.push('rocks')
  }
  for (let g = 0, n = 1 + (R() * 2 | 0); g < n; g++) {
    group()
    const home = spot((x, y, d) => d > 34 && depth(x, y, d) < 90 && x > 60 && x < W - 60 && y > 50 && y < H - 50, around(30)), lean = R() * 6.283
    if (!home) continue
    const sizes = Array.from({ length: 6 + (R() * 5 | 0) }, (_, i) => i ? i < 2 ? 12 + R() * 9 : i < 5 ? 10 + R() * 6 : 6 + R() * 4 : 18 + R() * 4).sort((a, b) => b - a)
    const mx = home[0] + Math.cos(lean) * 12, my = home[1] + Math.sin(lean) * 10, leaves = [[...home, sizes[0]]], off = (q: number[]) => Math.hypot(q[0] - mx, q[1] - my)
    for (const r of sizes.slice(1)) {
      let best: number[] | undefined
      for (let k = 0; k < 24; k++) {
        const [bx, by, br] = leaves[R() * leaves.length | 0], a = R() * 6.283, far = br + r - (R() < .55 ? (.1 + R() * .2) * Math.min(br, r) : -R() * 2)
        const q = [Math.round(bx + Math.cos(a) * far), Math.round(by + Math.sin(a) * far * .88), r], [x, y] = q
        if (x > 12 && y > 16 && x < W - 12 && y < H - 10 && sd(x, y) > r + 3 && (!best || off(q) < off(best)) && leaves.every(([lx, ly, lr]) => Math.hypot(lx - x, (ly - y) / .88) > lr + r - .31 * Math.min(lr, r)) && p.clear(around(r + 6)(x, y), id)) best = q
      }
      if (best) leaves.push(best)
    }
    const wide = Math.max(...leaves.map(l => l[0] + l[2])) - Math.min(...leaves.map(l => l[0] - l[2])), tall = Math.max(...leaves.map(l => l[1] + l[2] * .82)) - Math.min(...leaves.map(l => l[1] - l[2] * .82))
    for (const [x, y, r] of [...leaves].sort((a, b) => a[1] - b[1])) pad(p, x, y, r, R() * 6.283, R)
    for (const [x, y, r] of leaves.slice(0, 1 + (R() * 2 | 0)).filter(l => l[2] > 13)) lily(p, x + (R() - .5) * r * .5, y + (R() - .5) * r * .4, 9 + R() * 3, R)
    wakes.push(home)
    made.push('pads ' + Math.max(wide / tall, tall / wide).toFixed(2))
  }
  group()
  for (let tries = 0; tries < 12; tries++) {
    const at = spot((x, y, d) => d < -6 && d > -16 && Math.abs(sd(x + 10, y) - sd(x - 10, y)) > 9 && x > 90 && x < W - 90 && y > 50 && y < H - 50)
    if (!at) break
    const toward = Math.atan2(sd(at[0], at[1] + 5) - sd(at[0], at[1] - 5), sd(at[0] + 5, at[1]) - sd(at[0] - 5, at[1])), flat = Math.cos(toward) < 0 ? Math.PI : 0
    const ang = flat + clamp(wrap(toward - flat), -.6, .6), len = 84 + R() * 36
    if (![0, 1, 2, 3, 4, 5, 6, 7, 8].every(i => p.clear(around(14)(at[0] + Math.cos(ang) * len * i / 8, at[1] + Math.sin(ang) * len * i / 8), id))) continue
    branch(p, at[0], at[1], len, ang, R, wet)
    made.push('branch')
    break
  }
  for (let g = 0; g < 5; g++) {
    group()
    const home = spot((x, y, d) => grassy(x, y, d) && (g > 2 || -d < beach(x, y) + 44), around(12)), tufts: number[][] = []
    if (!home) continue
    for (let i = 0, n = 3 + (R() * 5 | 0); i < n; i++) {
      const r = 8 + R() * 7, at = near(home, 30, (x, y, d) => grassy(x, y, d) && apart(tufts, x, y, r * .6), (x, y) => [x - r - 3, y - r - 2, x + r + 3, y + 3])
      if (at) tufts.push([...at, r * .6, r])
    }
    for (const [x, y, , r] of tufts.sort((a, b) => a[1] - b[1])) tuft(p, x, y, r, R() * 4 | 0, R)
    p.tag(0)
    for (let i = 0; i < 6; i++) {
      const x = Math.round(home[0] + (R() + R() - 1) * 36), y = Math.round(home[1] + (R() + R() - 1) * 25)
      if (grassy(x, y, sd(x, y))) tick(x, y, R() < .6)
    }
  }
  for (let g = 0; g < 2; g++) {
    group()
    const at = spot(grassy, around(9, 7))
    if (at) clover(p, at[0], at[1], 5 + (R() * 3 | 0), R)
  }
  for (let g = 0; g < 2; g++) {
    group()
    const home = spot((x, y, d) => grassy(x, y, d) && (g > 0 || -d < beach(x, y) + 30), around(8, 10)), blooms: number[][] = home ? [[...home, 6]] : []
    if (home) for (let i = 1, m = g ? 4 + (R() * 4 | 0) : 2 + (R() * 3 | 0); i < m; i++) {
      const at = near(home, 26, (x, y, d) => grassy(x, y, d) && apart(blooms, x, y, 6), (x, y) => [x - 7, y - 7, x + 7, y + 10])
      if (at) blooms.push([...at, 6])
    }
    for (const [x, y] of blooms.sort((a, b) => a[1] - b[1])) bloom(p, x, y, g ? 5 : 4.5, !g, R)
  }
  for (let i = 0, last: number[] | undefined; i < 4; i++) {
    group()
    const r = 8 + R() * 5, box: Box = (x, y) => [x - r - 3, y - r - 2, x + r + 3, y + 3], at = last && near(last, 110, inland, box) || spot(inland, box)
    if (at) tuft(p, at[0], at[1], r, R() * 4 | 0, R), last = at
  }
  p.tag(0)
  for (let i = 0; i < 2; i++) {
    const at = spot(inland)
    if (at) for (let k = 0, n = 4 + (R() * 3 | 0), x = at[0]; k < n; k++) tick(Math.round(x += 6 + R() * 6), Math.round(at[1] + (R() - .5) * 6), R() < .3)
  }
  for (let i = 0; i < 2; i++) {
    const at = spot((x, y, d) => depth(x, y, d) > 110 && x < W - 70)
    if (at) for (let k = 0, n = 24 + R() * 32; k < n; k++) p.lift(at[0] + k, at[1])
  }
  for (let i = 0; i < 4; i++) {
    const at = i < 2 || !wakes.length ? spot((x, y, d) => depth(x, y, d) > 90, around(5, 3)) : near(wakes[R() * wakes.length | 0], 50, (_x, _y, d) => d > 8, around(5, 3))
    if (at) ring(p, at[0], at[1])
  }
  for (let i = 0; i < 22; i++) {
    const [hx, hy] = i < 18 && wakes.length ? wakes[i % wakes.length] : [R() * W, R() * H], x = Math.round(hx + (R() + R() - 1) * 46), y = Math.round(hy + (R() + R() - 1) * 30)
    if (sd(x, y) > 6) for (let k = 0, n = [2, 4, 7][R() * 3 | 0]; k < n; k++) p.lift(x + k, y)
  }
  return { p, made }
}

export const scene = (seed: number, look: number) => build(seed, look).p.done()

export function audit(seed: number) {
  const { p, made } = build(seed, 0)
  return [p.clash(), ...made]
}
