import { hash } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import type { Look } from '../../data/place/looks'
import type { Board } from '../../world/place/board'
import type { Mask } from '../../world/place/land'

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
