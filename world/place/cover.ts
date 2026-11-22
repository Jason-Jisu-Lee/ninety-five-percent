import { hash } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import type { Look } from '../../data/place/looks'
import type { Board } from './board'
import type { Mask } from './land'

const LEAF = [['.##.', '####', '.##.'], ['##.', '###', '.##'], ['##', '##'], ['.#', '##'], ['###', '###']]

export function weed(b: Board, m: Mask, land: Mask, L: Look, seed: number) {
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && !!m[y * W + x] && !land[y * W + x]
  for (let cy = 0; cy * 4 < H; cy++) for (let cx = 0; cx * 5 < W; cx++) {
    const x = cx * 5 + (cy & 1 ? 2 : 0) + (hash(cx, cy, seed) * 2 | 0), y = cy * 4 + (hash(cx, cy, seed + 1) * 2 | 0), art = LEAF[hash(cx, cy, seed + 3) * LEAF.length | 0]
    const inner = on(x - 7, y - 6) && on(x + 10, y - 6) && on(x - 7, y + 8) && on(x + 10, y + 8)
    if (!on(x, y) || !on(x + 3, y + 2) || hash(cx, cy, seed + 2) > (inner ? .9 : .4)) continue
    art.forEach((row, j) => [...row].forEach((ch, i) => {
      if (ch === '#' && b.is(x + i, y + j, L.water)) b.set(x + i, y + j, L.weed[j === art.length - 1 ? 0 : j || row[i - 1] === '#' ? 1 : 2])
    }))
  }
}

export function mud(b: Board, m: Mask, L: Look) {
  const soil = [...L.grass.slice(1), ...L.earth.slice(1)], on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && !!m[y * W + x] && b.is(x, y, soil)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (on(x, y))
    b.set(x, y, L.earth[!on(x, y - 1) || !on(x - 1, y) ? 1 : (x * 3 + (y >> 1) * 7) % 23 < 2 && y % 5 === 2 ? 3 : 2])
}

export function puddle(b: Board, x: number, y: number, rx: number, ry: number, L: Look) {
  const wet = (i: number, j: number) => ((i + .5) / rx) ** 2 + ((j + .5) / ry) ** 2 <= 1
  for (let j = -ry; j < ry; j++) for (let i = -rx; i < rx; i++) if (wet(i, j)) b.set(x + i, y + j, !wet(i, j - 1) ? L.earth[0] : !wet(i, j + 1) ? L.water[4] : !wet(i, j - 2) ? L.water[1] : L.water[2])
}
