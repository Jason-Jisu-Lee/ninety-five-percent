import { rng } from '../../core/math/rng'
import { EDGE, HUD } from '../../data/game/map'
import { H, W } from '../../data/look/screen'
import { key, ramps, type Look } from '../../data/place/looks'
import { board, type Key } from './board'
import { ground } from './ground'
import type { Mask } from './land'
import { props } from './props'
import { sparks } from './sparks'
import { water } from './water'

type Zone = { kind: 'pads' | 'reeds' | 'flowers' | 'stones' | 'log' | 'open' | 'mud' | 'weed' | 'shade'; x: number; y: number; rx: number; ry: number }
export type Perch = { x: number; y: number; h: number }
export type Place = {
  art: HTMLCanvasElement; look: Look; zones: Zone[]; perches: Perch[]; flowers: number[][]; sites: number[][]; swarms: number[][]; cover: number[][]; rafts: number[][]; sparks: number[][]
  wet(x: number, y: number, far?: number): boolean
}

function base(seed: number, L: Look, scale: number) {
  const R = rng(seed), b = board(ramps(L)), k = key(L), later: [number, () => void][] = [], S = (v: number) => Math.round(v * scale)
  const zones: Zone[] = [], perches: Perch[] = [], flowers: number[][] = [], sites: number[][] = [], swarms: number[][] = [], cover: number[][] = [], rafts: number[][] = []
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
    R, b, k, L, S, zones, perches, flowers, sites, swarms, cover, rafts, pick, zone, queue, sprite, wet, dry,
    lay(soil: Mask, deep: Mask | null, sun: Mask | null, calm = 1, rim = 7) {
      ground(b, land = soil, L, deep, sun, seed % 991, calm, rim)
    },
    done(): Place {
      later.sort((p, q) => p[0] - q[0]).forEach(([, draw]) => draw())
      const seen = ([x, y]: number[]) => x >= EDGE && x < W - EDGE && y >= EDGE && y < H - EDGE && !HUD.some(([l, t, r, d]) => x >= l && x < r && y >= t && y < d)
      return { art: b.done(), look: L, zones, perches, flowers: flowers.filter(seen), sites, swarms, cover, rafts, sparks: sparks(b, R, L), wet }
    },
  }
}

export type Base = ReturnType<typeof base>

export function kit(seed: number, L: Look, scale = 1) {
  const K = base(seed, L, scale)
  return { ...K, ...water(K, scale), ...props(K) }
}

export type Kit = ReturnType<typeof kit>
