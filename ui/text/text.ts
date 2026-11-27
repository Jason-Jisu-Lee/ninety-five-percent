import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { FONT } from '../../data/look/font'

const cache = new Map<string, HTMLCanvasElement>(), rows: Record<string, number[]> = {}, spans: Record<string, number> = {}

export const glyph = (ch: string) => rows[ch] ??= [...FONT[ch] ?? ''].map(c => parseInt(c, 32))

function span(ch: string) {
  if (spans[ch]) return spans[ch]
  const m = glyph(ch).reduce((a, b) => a | b, 0)
  return spans[ch] = m ? 5 - Math.log2(m & -m) : 3
}

export const width = (str: string) => [...str].reduce((w, ch) => w + span(ch) + 1, -1)

function raster(str: string, col: string, k: number) {
  const key = k + col + str, hit = cache.get(key)
  if (hit) return hit
  const c = mk(Math.max(1, width(str)) * k, 9 * k), g = ctx(c)
  let x = 0
  g.fillStyle = col
  for (const ch of str) {
    glyph(ch).forEach((row, j) => {
      for (let i = 0; i < 5; i++) if (row >> 4 - i & 1) g.fillRect((x + i) * k, j * k, k, k)
    })
    x += span(ch) + 1
  }
  if (cache.size > 400) cache.clear()
  cache.set(key, c)
  return c
}

export function text(g: Ctx, str: string, x: number, y: number, col: string, align?: 'c' | 'r', edge?: string, k = 1) {
  const t = raster(str, col, k), left = align === 'c' ? Math.round(x - t.width / 2) : align === 'r' ? x - t.width : x, top = y - 7 * k
  if (edge) for (let i = 0; i < 9; i++) g.drawImage(raster(str, edge, k), left + (i % 3 - 1) * k, top + ((i / 3 | 0) - 1) * k)
  g.drawImage(t, left, top)
}
