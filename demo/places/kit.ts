import { rng } from '../../core/math/rng'
import { H, W } from '../../data/look/screen'
import { board, type Key } from './board'
import { BLOOM } from './blooms'
import { ground } from './ground'
import type { Mask } from './land'
import { key, ramps, type Look } from './looks'
import { BUD, LILY, pad } from './pads'
import { blades, pool, STAND, TUFT } from './reeds'
import { log, SNAG, STONE } from './rocks'

export type Zone = { kind: 'pads' | 'reeds' | 'flowers' | 'stones' | 'log' | 'open' | 'mud' | 'weed' | 'shade'; x: number; y: number; rx: number; ry: number }
export type Place = { art: HTMLCanvasElement; zones: Zone[] }

const COLONY = [[0, 0, 22], [31, -7, 14], [-28, 9, 14], [9, 23, 12], [-16, -19, 8], [36, 11, 7], [-7, 27, 6], [-40, -4, 6]]
const PATCH = [[0, 0], [15, -6], [-14, -4], [8, 9], [-9, 11], [25, 5], [-26, 7], [3, -15], [31, -10], [-31, -8]]
const ROCKS = [[0, 0, 0], [22, 8, 1], [-18, 10, 1], [10, 16, 2], [-8, -9, 2], [30, -2, 2]]

export function kit(seed: number, L: Look, scale = 1) {
  const R = rng(seed), b = board(ramps(L)), k = key(L), zones: Zone[] = [], later: [number, () => void][] = [], S = (v: number) => Math.round(v * scale)
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
    R, b, k, L, zones, pick, zone, queue, sprite, wet, dry,
    lay(soil: Mask, deep: Mask | null, sun: Mask | null, calm = 1) {
      ground(b, land = soil, L, deep, sun, seed % 991, calm)
    },
    pads(x: number, y: number, n: number, lily = true) {
      const flip = R() < .5 ? -1 : 1, turn = R() * 8 | 0
      COLONY.slice(0, n).forEach(([dx, dy, r], i) => {
        const rx = Math.max(4, S(r)), rows = pad(rx, (turn + i * 3) % 8), px = Math.round(x + dx * flip * scale) - rx, py = Math.round(y + dy * scale) - rows.length / 2
        if (!wet(px + rx, py + rows.length / 2, rx)) return
        sprite(rows, px, py, false, k, rx > 10 ? 3 : 2)
        if (lily && rx > 12 && (i === 0 || R() < .5)) queue(py + rows.length + 1, () => {
          const [lx, ly] = [px + rx - 7 + (i ? 0 : 5 * flip), py + rows.length / 2 - 9]
          b.cast(LILY, lx, ly, 2, 3)
          b.art(LILY, lx, ly, k)
        })
        else if (lily && rx > 7 && rx < 13 && R() < .5) sprite(BUD, px + rx - 2, py + rows.length / 2 - 3, false, k, 1)
      })
      zone('pads', x, y + S(2), S(46), S(34))
    },
    reeds(x: number, y: number, n: number, pond = true) {
      ;[0, -22, 20, -40, 38, -58, 56].slice(0, n).forEach((dx, i) => queue(y + (i % 2 ? 3 : 0) + 4, () => {
        if (pond) pool(b, x + S(dx), y + (i % 2 ? 3 : 0), S(i ? 10 : 15))
        blades(b, STAND[i ? 1 + (i + (R() * 2 | 0)) % 2 : 0], x + S(dx), y + (i % 2 ? 3 : 0), k, R() < .5, scale)
      }))
      zone('reeds', x + (n > 2 ? 0 : S(-8)), y - S(24), S(20 + n * 10), S(36))
    },
    tuft: (x: number, y: number, flip = R() < .5) => queue(y, () => {
      for (let i = -4; i < 6; i++) b.dim(x + i, y + 1)
      blades(b, pick(TUFT), x, y, k, flip)
    }),
    blooms(x: number, y: number, n: number, kinds: number[]) {
      const flip = R() < .5 ? -1 : 1
      PATCH.slice(0, n).forEach(([dx, dy], i) => {
        const art = BLOOM[kinds[i % kinds.length]], bx = x + dx * flip, by = y + dy
        if (dry(bx, by, 6)) sprite(art, bx - (art[0].length >> 1), by - art.length, R() < .5, k, 1)
      })
      zone('flowers', x, y - 8, n > 5 ? 40 : 26, n > 3 ? 22 : 16)
    },
    stones(x: number, y: number, n: number) {
      ROCKS.slice(0, n).forEach(([dx, dy, s]) => sprite(STONE[s], x + dx - (STONE[s][0].length >> 1), y + dy - STONE[s].length, R() < .5, k, s < 2 ? 3 : 1))
      zone('stones', x + 4, y - 2, 30, 20)
    },
    log(x: number, y: number, len: number, every: number) {
      queue(y + 9, () => log(b, x, y, len, every, k))
      zone('log', x + len / 2, y + 4 + (every ? len / every / 2 : 0), len / 2 + 6, 14)
    },
    snag(x: number, y: number) {
      queue(y, () => pool(b, x, y - 2, 9))
      sprite(SNAG, x - 10, y - SNAG.length, R() < .5, k, 0)
      zone('log', x, y - 8, 18, 16)
    },
    ring(slots: number[][], items: ((x: number, y: number) => void)[]) {
      const turn = R() * slots.length | 0, n = Math.min(items.length, slots.length)
      items.slice(0, n).forEach((put, i) => {
        const [x, y] = slots[(turn + Math.floor(i * slots.length / n)) % slots.length]
        put(Math.round(x + (R() - .5) * 16), Math.round(y + (R() - .5) * 10))
      })
    },
    done(): Place {
      later.sort((p, q) => p[0] - q[0]).forEach(([, draw]) => draw())
      return { art: b.done(), zones }
    },
  }
}

export type Kit = ReturnType<typeof kit>
