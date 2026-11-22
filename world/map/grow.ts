import { H, W } from '../../data/look/screen'
import { CX, CY, MH, MW, type Own } from '../../data/map/plan'
import { off, type Land, type Rand } from './land'

export type Kind = 'clump' | 'daisy' | 'dandelion' | 'rosette' | 'clover' | 'reed' | 'pad' | 'lily' | 'pebble' | 'slab' | 'mushroom' | 'leaf' | 'twig' | 'fruit'
export type Thing = { kind: Kind; x: number; y: number; a: number; b: number; c: number; own?: Own }
type Test = (x: number, y: number) => unknown

export function grow(R: Rand, L: Land) {
  const out: Thing[] = [], { wet, lake, sun, shade, bare, trees, trunk, log, pond, rocks, brook, wide } = L
  const add = (kind: Kind, x: number, y: number, a = 0, b = 0, c = 0, own?: Own) => void out.push({ kind, x, y, a, b, c, own })
  const dry = (x: number, y: number, pad = 6) => wet(x, y) < -pad && off(trunk, x, y) > pad && off(log, x, y) > pad && trees.every(t => Math.hypot(t.x - x, t.y - y) > t.r + pad)
  const soil = (x: number, y: number, pad = 6) => dry(x, y, pad) && bare(x, y) < .3
  const home = (x: number, y: number) => Math.hypot(x - CX, y - CY), bell = () => (R() + R() + R() - 1.5) / 1.5
  const view = [CX - W * .42, CY - H * .4, CX + W * .42, CY + H * .4] as const
  const drift = (cx: number, cy: number, n: number, rx: number, ry: number, rot: number, put: (x: number, y: number, far: number) => unknown) => {
    for (let i = 0, c = Math.cos(rot), s = Math.sin(rot); i < n; i++) {
      const u = bell(), v = bell()
      put(cx + u * c * rx - v * s * ry, cy + u * s * rx + v * c * ry, Math.hypot(u, v))
    }
  }
  const spot = (ok: Test, x0 = 0, y0 = 0, x1 = MW, y1 = MH) => {
    for (let i = 0; i < 90; i++) {
      const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0)
      if (ok(x, y)) return [x, y]
    }
  }
  const each = (n: number, ok: Test, put: (x: number, y: number, i: number) => unknown, inView = 0) => {
    for (let i = 0; i < n; i++) {
      const at = i < inView && spot(ok, ...view) || spot(ok)
      if (at) put(at[0], at[1], i)
    }
  }

  for (let i = 0; i < 170; i++) {
    const x = R() * MW, y = R() * MH
    if (R() < .18 + .8 * sun(x, y) - .1 * shade(x, y) && soil(x, y, 10)) drift(x, y, 2 + (R() * R() * 10 | 0), 30 + R() * 40, 18 + R() * 24, R() * 3.14, (px, py, f) => soil(px, py, 8) && add('clump', px, py, 9 + (R() * 3 | 0), (14 + R() * 6) * (1.15 - .3 * f)))
  }
  const wind = R() * 3.14, bloom = (x: number, y: number) => sun(x, y) > .25 && soil(x, y) && add('daisy', x, y, R() * 3, 0, 0, 'flowers')
  each(7 + (R() * 4 | 0), (x, y) => sun(x, y) > .55 && soil(x, y), (x, y) => drift(x, y, 6 + (R() * 16 | 0), 46 + R() * 60, 18 + R() * 24, wind + (R() - .5) * .7, bloom), 1)
  each(10, (x, y) => sun(x, y) > .3 && sun(x, y) < .95 && soil(x, y), (x, y) => drift(x, y, 1 + (R() * 3 | 0), 16, 10, 0, (px, py) => soil(px, py) && add('dandelion', px, py, 0, 0, 0, 'flowers')), 1)
  each(12, (x, y) => sun(x, y) > .3 && soil(x, y), bloom)
  each(9, (x, y) => sun(x, y) > .4 && soil(x, y, 14), (x, y) => add('clover', x, y, 5 + (R() * 3 | 0)))
  each(14, (x, y) => shade(x, y) > .25 && shade(x, y) < .75 && soil(x, y, 10), (x, y) => add('rosette', x, y, 1))
  let dell: number[] | undefined, best = -9
  for (let i = 0; i < 60; i++) {
    const x = view[0] + R() * W * .84, y = view[1] + R() * H * .8, score = shade(x, y) - Math.abs(wet(x, y) + 80) / 200
    if (score > best && soil(x, y, 20) && home(x, y) > 90) [dell, best] = [[x, y], score]
  }
  if (dell) drift(dell[0], dell[1], 9 + (R() * 6 | 0), 66, 40, R() * 3.14, (x, y, f) => soil(x, y, 10) && add('rosette', x, y, 1.55 - .4 * f, 0, 0, 'ferns'))

  const toHome = Math.atan2(CY - pond.y, CX - pond.x), rim = (ang: number, d: number) => [pond.x + Math.cos(ang) * d, pond.y + Math.sin(ang) * d]
  const shore = (ang: number) => {
    let lo = 0, hi = pond.rx * 2
    for (let i = 0; i < 16; i++) lake(...rim(ang, (lo + hi) / 2) as [number, number]) > 0 ? lo = (lo + hi) / 2 : hi = (lo + hi) / 2
    return lo
  }
  for (let i = 0, n = 3 + (R() * 2 | 0); i < n; i++) {
    const edge = !i && spot((x, y) => Math.abs(lake(x, y)) < 5, ...view), mid = edge ? Math.atan2(edge[1] - pond.y, edge[0] - pond.x) : i ? R() * 6.283 : toHome + (R() - .5) * .8, tufts = 4 + (R() * 5 | 0)
    for (let j = 0; j < tufts; j++) {
      const ang = mid + (j - tufts / 2) * 34 / shore(mid), [cx, cy] = rim(ang, shore(ang) - 4 + R() * 10), tall = 1.1 - .5 * Math.abs(j / (tufts - 1) - .5)
      for (let q = 2 + (R() * 5 | 0); q--;) {
        const x = cx + (R() - .5) * 18, y = cy + (R() - .5) * 10
        if (Math.abs(lake(x, y) - 1) < 15) add('reed', x, y, (17 + R() * 12) * tall, (R() - .5) * 14, R() < .5 ? 1 : 0, 'reeds')
      }
    }
  }
  each(8, (x, y) => soil(x, y) && home(x, y) > 50, (x, y, i) => add('reed', x, y, 20 + R() * 7, (R() - .5) * 10, i < 5 ? 3 : 2), 2)
  const pads: number[][] = []
  for (let i = 0, n = 2 + (R() * 2 | 0); i < n; i++) {
    const ang = i ? R() * 6.283 : toHome + (R() - .5), [cx, cy] = !i && spot((x, y) => lake(x, y) > 24 && lake(x, y) < 120, ...view) || rim(ang, shore(ang) - 50 - R() * 50)
    drift(cx, cy, 3 + (R() * 4 | 0), 44, 30, R() * 3.14, (x, y) => {
      const r = 11 + R() * R() * 18, turn = R() * 6.283
      if (lake(x, y) < r + 10 || pads.some(([px, py, pr]) => Math.hypot(px - x, py - y) < pr + r + 3)) return
      pads.push([x, y, r])
      add('pad', x, y, r, turn, 0, 'pads')
      if (R() < .45) add('lily', x + (r + 5) * Math.cos(turn + 2), y + (r + 5) * Math.sin(turn + 2) * .8, 0, 0, 0, 'pads')
    })
  }

  const stones: number[][] = [], rock = (kind: Kind, x: number, y: number, rx: number, own?: Own) => {
    if (!dry(x, y, rx * .7) || stones.some(([px, py, pr]) => Math.hypot(px - x, py - y) < (pr + rx) * .9)) return
    stones.push([x, y, rx])
    add(kind, x, y, rx, rx * (.55 + R() * .12), 0, own)
  }
  drift(rocks.x, rocks.y, 4 + (R() * 3 | 0), rocks.rx * .5, rocks.ry * .5, rocks.rot, (x, y) => rock('pebble', x, y, 22 + R() * 30))
  drift(rocks.x, rocks.y, 5 + (R() * 3 | 0), rocks.rx * .8, rocks.ry * .8, rocks.rot, (x, y) => rock('slab', x, y, 14 + R() * 10, 'stones'))
  for (let i = 0; i < 3; i++) rock('pebble', CX + (rocks.x - CX) * (.3 + i * .2 + R() * .1) + (R() - .5) * 90, CY + (rocks.y - CY) * (.3 + i * .2 + R() * .1) + (R() - .5) * 90, 7 + R() * 7)
  each(2, (x, y) => soil(x, y, 16) && home(x, y) > 60, (x, y) => rock('slab', x, y, 13 + R() * 8, 'stones'), 2)
  drift(rocks.x, rocks.y, 60, rocks.rx * 1.2, rocks.ry * 1.2, rocks.rot, (x, y) => rock('pebble', x, y, 2.5 + R() * 3.5))
  each(46, dry, (x, y) => rock('pebble', x, y, 2.5 + R() * 3))
  for (const [bx, by] of brook) if (lake(bx, by) < -30) for (let q = 3; q--;) rock('pebble', bx + (R() - .5) * (wide + 30) * 2, by + (R() - .5) * (wide + 30) * 2, 3 + R() * 5)

  const troop = (x: number, y: number, own?: Own) => drift(x, y, 3 + (R() * 4 | 0), 12, 8, 0, (px, py) => dry(px, py, 2) && add('mushroom', px, py, 2.6 + R() * 2.4, 0, 0, own))
  for (const t of [trunk, trunk, trunk, log]) {
    const u = t.len * (.15 + R() * .7), v = t.r + 6 + R() * 10
    troop(t.x + Math.cos(t.ang) * u - Math.sin(t.ang) * v, t.y + Math.sin(t.ang) * u + Math.cos(t.ang) * v, t === log ? 'log' : undefined)
  }
  for (const t of trees) {
    const a = R() * 6.283, d = t.r * (1.8 + R() * 1.6), far = t.r + 10 + R() * 14
    if (R() < .7) troop(t.x + Math.cos(a + 2) * far, t.y + Math.sin(a + 2) * far)
    if (dry(t.x + Math.cos(a) * d, t.y + Math.sin(a) * d, 30)) add('twig', t.x + Math.cos(a) * d, t.y + Math.sin(a) * d, (R() - .5) * 1.4, 60 + R() * 35, (R() - .5) * 14)
    for (let q = 5 + (R() * 6 | 0); q--;) {
      const b = R() * 6.283, e = t.r * (1.3 + R() * 2.6), x = t.x + Math.cos(b) * e, y = t.y + Math.sin(b) * e
      if (dry(x, y)) add('leaf', x, y, R() * 6.283, 20 + R() * 10)
    }
  }
  each(1, (x, y) => soil(x, y, 30) && home(x, y) > 70, (x, y) => add('twig', x, y, (R() - .5) * 1.2, 70 + R() * 25, (R() - .5) * 12), 1)
  const ring = spot((x, y) => shade(x, y) > .2 && soil(x, y, 40) && home(x, y) > 110, ...view) ?? spot((x, y) => soil(x, y, 40) && home(x, y) > 110, ...view) ?? spot((x, y) => soil(x, y, 40))
  if (ring) for (let i = 0, n = 9 + (R() * 5 | 0), r = 24 + R() * 12; i < n; i++) add('mushroom', ring[0] + Math.cos((i + R() * .5) / n * 6.283) * r, ring[1] + Math.sin((i + R() * .5) / n * 6.283) * r * .8, 3 + R() * 1.6, 0, 0, 'ring')
  each(1, (x, y) => soil(x, y, 14) && home(x, y) > 60, (x, y) => add('fruit', x, y, 9 + R() * 2, 0, 0, 'fruit'), 1)
  return out
}
