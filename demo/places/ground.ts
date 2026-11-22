import { hash } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import type { Board } from './board'
import { reach, type Mask } from './land'
import type { Look } from './looks'

const FACE = 5, FOAM = '#####..###.#######...####.##...######.#..'
const RIPPLE = [['######', '..###'], ['####'], ['###.....', '....####'], ['#####', '.##'], ['###']]
const BLADE = [['#.#', '.#.'], ['#.#.#', '.#.#.'], ['#', '#'], ['.#', '#.'], ['#.', '.#']]

export function ground(b: Board, land: Mask, L: Look, deep: Mask | null, sun: Mask | null, seed: number, calm = 1) {
  const far = reach(land, 14), dry = reach(land.map(v => 1 - v), 14), { water: w, grass: g, earth: e } = L
  const is = (m: Mask | null, x: number, y: number) => !!m?.[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))]
  const soil = (x: number, y: number) => is(land, x, y)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x
    if (land[i]) {
      let s = 0
      while (s <= FACE && soil(x, y + s + 1)) s++
      b.set(x, y, s < FACE ? e[s ? s < 3 ? 1 : 2 : 0] : s === FACE ? g[3] : !soil(x, y - 1) || !soil(x - 1, y) || !soil(x + 1, y) ? g[0] : sun?.[i] ? g[2] : g[1])
      continue
    }
    let n = 0
    while (n < 4 && !soil(x, y - n - 1)) n++
    b.set(x, y, n === 0 ? FOAM[(x * 3 + y) % FOAM.length] === '#' ? w[4] : w[3] : n < 3 || n === 3 && FOAM[(x + y * 5) % FOAM.length] === '#' ? w[0] : deep?.[i] ? w[1] : w[2])
  }
  const marks = (set: string[][], cw: number, ch: number, fill: number, ok: (x: number, y: number) => string | false | undefined) => {
    for (let cy = 0; cy * ch < H; cy++) for (let cx = 0; cx * cw < W; cx++) {
      if (hash(cx, cy, seed) > fill * (hash(cx >> 2, cy >> 2, seed + 5) > .45 ? 1.5 : .35)) continue
      const art = set[hash(cx, cy, seed + 1) * set.length | 0], x = cx * cw + (hash(cx, cy, seed + 2) * (cw - 8) | 0), y = cy * ch + (hash(cx, cy, seed + 3) * (ch - 3) | 0)
      const wide = Math.max(...art.map(r => r.length)), col = x + wide < W && y + 2 < H && ok(x, y)
      if (col && ok(x + wide, y) === col && ok(x, y + 2) === col && ok(x + wide, y + 2) === col) b.art(art, x, y, { '#': col })
    }
  }
  marks(RIPPLE, 44, 22, .5 * calm, (x, y) => !soil(x, y) && far[y * W + x] > 12 && (is(deep, x, y) ? w[2] : w[3]))
  marks(BLADE, 18, 12, .5, (x, y) => soil(x, y) && dry[y * W + x] > 9 && (is(sun, x, y) ? g[3] : g[2]))
}
