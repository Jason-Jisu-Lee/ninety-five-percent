import { hash } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import type { Board } from './board'
import type { Mask } from './land'
import type { Look } from './looks'

const ARC = [['..####..', '.#....#.', '#......#'], ['.###.', '#...#'], ['...#####...', '.##.....##.', '#.........#']]

export function canopy(b: Board, m: Mask, L: Look, seed: number) {
  const c = L.shade, on = (x: number, y: number) => x < 0 || y < 0 || x >= W || y >= H || !!m[y * W + x]
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (m[y * W + x]) for (let n = 1; n < 6; n++) b.dim(x + n, y + n + 2)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (m[y * W + x])
    b.set(x, y, c[!on(x + 2, y + 2) || !on(x, y + 3) ? 0 : !on(x - 2, y - 2) || !on(x, y - 2) ? 2 : 1])
  for (let cy = 0; cy * 11 < H; cy++) for (let cx = 0; cx * 15 < W; cx++) {
    const art = ARC[hash(cx, cy, seed) * ARC.length | 0], x = cx * 15 + (cy & 1 ? 7 : 0) + (hash(cx, cy, seed + 1) * 5 | 0), y = cy * 11 + (hash(cx, cy, seed + 2) * 4 | 0)
    if (![[0, 0], [12, 0], [0, 6], [12, 6], [-3, -3], [15, 9]].every(([dx, dy]) => on(x + dx, y + dy))) continue
    b.art(art, x, y, { '#': c[hash(cx, cy, seed + 3) < .3 ? 3 : 2] })
    b.art(art, x, y + art.length, { '#': c[0] })
  }
}

export function weed(b: Board, m: Mask, land: Mask, L: Look) {
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && !!m[y * W + x] && !land[y * W + x]
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!on(x, y) && (on(x - 1, y - 1) || on(x - 2, y - 2))) b.dim(x, y)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (on(x, y) && b.is(x, y, L.water))
    b.set(x, y, !on(x + 1, y + 1) || !on(x, y + 1) ? L.weed[0] : !on(x - 1, y - 1) ? L.weed[2] : (x + (y >> 1) * 5) % 9 < 2 && y % 4 === 1 && on(x + 3, y + 2) && on(x - 3, y - 2) ? L.weed[y % 8 === 1 ? 2 : 0] : L.weed[1])
}

export function mud(b: Board, m: Mask, L: Look) {
  const soil = [L.grass[1], L.grass[2], L.earth[1], L.earth[2], L.earth[3]], on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && !!m[y * W + x] && b.is(x, y, soil)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (on(x, y))
    b.set(x, y, L.earth[!on(x, y - 1) || !on(x - 1, y) ? 1 : (x * 3 + (y >> 1) * 7) % 23 < 2 && y % 5 === 2 ? 3 : 2])
}
