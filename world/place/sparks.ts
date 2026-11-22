import { H, W } from '../../data/look/screen'
import type { Look } from '../../data/place/looks'
import type { Board } from './board'

export function sparks(b: Board, R: () => number, L: Look) {
  const out: number[][] = [], calm = [L.water[1], L.water[2]]
  for (let i = 0; i < 4000 && out.length < 16; i++) {
    const x = 8 + R() * (W - 30) | 0, y = 24 + R() * (H - 40) | 0, len = 3 + (R() * 4 | 0)
    if ([-4, 0, len, len + 6].every(dx => [-3, 0, 3].every(dy => b.is(x + dx, y + dy, calm))) && out.every(s => Math.hypot(s[0] - x, s[1] - y) > 40)) out.push([x, y, len, R() * 6])
  }
  return out
}
