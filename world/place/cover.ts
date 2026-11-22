import { H, W } from '../../data/look/screen'
import type { Board } from './board'
import type { Mask } from './land'
import type { Look } from '../../data/place/looks'

export function weed(b: Board, m: Mask, land: Mask, L: Look) {
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && !!m[y * W + x] && !land[y * W + x]
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!on(x, y) && (on(x - 1, y - 1) || on(x - 2, y - 2))) b.dim(x, y)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (on(x, y) && b.is(x, y, L.water))
  {
    const r = y / 3 | 0, u = x + r % 2 * 2, c = u / 3 | 0, far = on(x + 5, y + 5) && on(x - 5, y - 5) && on(x + 5, y - 5) && on(x - 5, y + 5)
    if (u % 3 < 2 && y % 3 < 2 && (far || (c * 7 + r * 13) % 5 < 2)) b.set(x, y, L.weed[(c + r * 3) % 5 ? y % 3 ? 0 : 1 : 2])
  }
}

export function mud(b: Board, m: Mask, L: Look) {
  const soil = [L.grass[1], L.grass[2], L.earth[1], L.earth[2], L.earth[3]], on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && !!m[y * W + x] && b.is(x, y, soil)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (on(x, y))
    b.set(x, y, L.earth[!on(x, y - 1) || !on(x - 1, y) ? 1 : (x * 3 + (y >> 1) * 7) % 23 < 2 && y % 5 === 2 ? 3 : 2])
}
