import { rng } from '../../core/math/rng'
import { H, W } from '../../data/look/screen'
import { key, ramps, type Look } from '../../data/place/looks'
import { board, type Key } from './board'
import { BLOOM } from './blooms'
import { ground } from './ground'
import type { Mask } from './land'
import { BUD, LILY, pad } from './pads'
import { blades, heads, pool, STAND, TUFT } from './reeds'
import { log, SNAG, STONE } from './rocks'

type Zone = { kind: 'pads' | 'reeds' | 'flowers' | 'stones' | 'log' | 'open' | 'mud' | 'weed' | 'shade'; x: number; y: number; rx: number; ry: number }
export type Perch = { x: number; y: number; h: number }
export type Place = {
  art: HTMLCanvasElement; look: Look; zones: Zone[]; perches: Perch[]; flowers: number[][]; sites: number[][]; swarms: number[][]; cover: number[][]; sparks: number[][]
  wet(x: number, y: number, far?: number): boolean
}

const COLONY = [[0, 0, 22], [31, -7, 14], [-28, 9, 14], [9, 23, 12], [-16, -19, 8], [36, 11, 7], [-7, 27, 6], [-40, -4, 6]]
const PATCH = [[0, 0], [15, -6], [-14, -4], [8, 9], [-9, 11], [25, 5], [-26, 7], [3, -15], [31, -10], [-31, -8]]
const ROCKS = [[0, 0, 0], [22, 8, 1], [-18, 10, 1], [10, 16, 2], [-8, -9, 2], [30, -2, 2]]

export function kit(seed: number, L: Look, scale = 1) {
  const R = rng(seed), b = board(ramps(L)), k = key(L), later: [number, () => void][] = [], S = (v: number) => Math.round(v * scale)
  const zones: Zone[] = [], perches: Perch[] = [], flowers: number[][] = [], sites: number[][] = [], swarms: number[][] = [], cover: number[][] = []
  let land: Mask = new Uint8Array(W * H)
  const pick = <T>(list: T[]) => list[R() * list.length | 0]
  const zone = (kind: Zone['kind'], x: number, y: number, rx: number, ry = rx) => zones.push({ kind, x, y, rx, ry })
  const queue = (y: number, draw: () => void) => later.push([y, draw])
  const sprite = (rows: string[], x: number, y: number, flip = false, keys: Key = k, drop = 2) => queue(y + rows.length, () => {
    if (drop) b.cast(rows, x, y, drop, drop + 1, flip)
    b.art(rows, x, y, keys, flip)
  })
  const all = (v: number) => (x: number, y: number, far = 0) => [[0, 0], [far, 0], [-far, 0], [0, far], [0, -far]].every(([dx, dy]) => land[Math.min(H - 1, Math.max(0, Math.round(y + dy))) * W + Math.min(W - 1, Math.max(0, Math.round(x + dx)))] === v)
  const wet = all(0), dry = all(1)
  return {
    R, b, k, L, zones, swarms, pick, zone, queue, sprite, wet, dry,
    lay(soil: Mask, deep: Mask | null, sun: Mask | null, calm = 1, rim = 7) {
      ground(b, land = soil, L, deep, sun, seed % 991, calm, rim)
    },
    pads(x: number, y: number, n: number, lily = true) {
      const flip = R() < .5 ? -1 : 1, turn = R() * 8 | 0
      COLONY.slice(0, n).forEach(([dx, dy, r], i) => {
        const rx = Math.max(4, S(r)), rows = pad(rx, (turn + i * 3) % 8), cx = Math.round(x + dx * flip * scale), cy = Math.round(y + dy * scale), px = cx - rx, py = cy - rows.length / 2
        const bloom = lily && rx > 12 && (i === 0 || R() < .5)
        if (!wet(cx, cy, rx)) return
        sprite(rows, px, py, false, k, rx > 10 ? 3 : 2)
        if (rx > 7) sites.push([cx, cy])
        if (bloom) queue(py + rows.length + 1, () => {
          const [lx, ly] = [cx - 7 + (i ? 0 : 5 * flip), cy - 9]
          b.cast(LILY, lx, ly, 2, 3)
          b.art(LILY, lx, ly, k)
        })
        else if (rx > 7) perches.push({ x: cx, y: cy + 1, h: 1 })
        if (!bloom && lily && rx > 7 && rx < 13 && R() < .5) sprite(BUD, cx + rx - 5, cy - rows.length / 2 - 1, false, k, 1)
      })
      zone('pads', x, y + S(2), S(46), S(34))
    },
    reeds(x: number, y: number, n: number, pond = true) {
      ;[0, -22, 20, -40, 38, -58, 56].slice(0, n).forEach((dx, i) => {
        const set = STAND[i ? 1 + (i + (R() * 2 | 0)) % 2 : 0], flip = R() < .5, bx = x + S(dx), by = y + (i % 2 ? 3 : 0), tops = heads(set, bx, by, flip, scale)
        if (i % 3 === 0 && tops.length) perches.push(tops.reduce((p, q) => q.h > p.h ? q : p))
        queue(by + 4, () => {
          if (pond) pool(b, bx, by, S(i ? 10 : 15))
          blades(b, set, bx, by, k, flip, scale)
        })
      })
      swarms.push([x, y - S(34)])
      zone('reeds', x + (n > 2 ? 0 : S(-8)), y - S(24), S(20 + n * 10), S(36))
    },
    tuft(x: number, y: number, flip = R() < .5) {
      cover.push([x, y - 3])
      queue(y, () => {
        for (let i = -4; i < 6; i++) b.dim(x + i, y + 1)
        blades(b, pick(TUFT), x, y, k, flip)
      })
    },
    blooms(x: number, y: number, n: number, kinds: number[]) {
      const flip = R() < .5 ? -1 : 1
      PATCH.slice(0, n).forEach(([dx, dy], i) => {
        const art = BLOOM[kinds[i % kinds.length]], bx = x + dx * flip, by = y + dy
        if (!dry(bx, by, 6)) return
        sprite(art, bx - (art[0].length >> 1), by - art.length, R() < .5, k, 1)
        flowers.push([bx, by - art.length + 3])
      })
      zone('flowers', x, y - 8, n > 5 ? 40 : 26, n > 3 ? 22 : 16)
    },
    stones(x: number, y: number, n: number) {
      ROCKS.slice(0, n).forEach(([dx, dy, s]) => {
        const art = STONE[s], sx = x + dx - (art[0].length >> 1), sy = y + dy - art.length
        sprite(art, sx, sy, R() < .5, k, s < 2 ? 3 : 1)
        queue(sy + art.length, () => {
          for (let i = 1; i < art[0].length - 1; i++) if (b.is(sx + i, sy + art.length, L.water.slice(0, 4))) b.set(sx + i, sy + art.length, L.water[i % 7 < 5 ? 4 : 3])
        })
        if (s > 1) return
        sites.push([x + dx, sy + 4])
        perches.push({ x: x + dx, y: sy + 5, h: 2 })
      })
      zone('stones', x + 4, y - 2, 30, 20)
    },
    log(x: number, y: number, len: number, every: number) {
      const at = (i: number) => y + (every ? Math.floor(i / every) : 0)
      queue(y + 9, () => log(b, x, y, len, every, k))
      for (const u of [.25, .7]) {
        const i = Math.round(len * u)
        sites.push([x + i, at(i) + 2])
        perches.push({ x: x + i, y: at(i) + 3, h: 3 })
      }
      swarms.push([x + len / 2, y - 6])
      zone('log', x + len / 2, y + 4 + (every ? len / every / 2 : 0), len / 2 + 6, 14)
    },
    snag(x: number, y: number) {
      queue(y, () => pool(b, x, y - 2, 9))
      sprite(SNAG, x - 10, y - SNAG.length, R() < .5, k, 0)
      perches.push({ x, y, h: (SNAG.length - 2) / .7 })
      sites.push([x, y - 8])
      zone('log', x, y - 8, 18, 16)
    },
    done(): Place {
      later.sort((p, q) => p[0] - q[0]).forEach(([, draw]) => draw())
      const sparks: number[][] = [], calm = [L.water[1], L.water[2]]
      for (let i = 0; i < 4000 && sparks.length < 16; i++) {
        const x = 8 + R() * (W - 30) | 0, y = 24 + R() * (H - 40) | 0, len = 3 + (R() * 4 | 0)
        if ([-4, 0, len, len + 6].every(dx => [-3, 0, 3].every(dy => b.is(x + dx, y + dy, calm))) && sparks.every(s => Math.hypot(s[0] - x, s[1] - y) > 40)) sparks.push([x, y, len, R() * 6])
      }
      return { art: b.done(), look: L, zones, perches, flowers, sites, swarms, cover, sparks, wet }
    },
  }
}

export type Kit = ReturnType<typeof kit>
