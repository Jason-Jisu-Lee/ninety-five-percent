import { pixels } from '../../core/draw/pixels'
import { u32 } from '../../core/screen/canvas'
import { H, W } from '../../data/look/screen'

export type Key = Record<string, string>

export function board(ramps: string[][]) {
  const p = pixels(W, H), darker = new Map<number, number>(), dimmed = new Uint8Array(W * H)
  for (const r of ramps) r.forEach((c, i) => i && darker.set(u32(c), u32(r[i - 1])))
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H
  const set = (x: number, y: number, col: string) => {
    if (!on(x, y)) return
    p.u[y * W + x] = u32(col)
    dimmed[y * W + x] = 0
  }
  const dim = (x: number, y: number) => {
    const i = y * W + x, to = on(x, y) && !dimmed[i] && darker.get(p.u[i])
    if (to) [p.u[i], dimmed[i]] = [to, 1]
  }
  const each = (rows: string[], x: number, y: number, flip: boolean, f: (px: number, py: number, ch: string) => void) => rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] !== '.' && row[i] !== ' ') f(x + (flip ? row.length - 1 - i : i), y + j, row[i])
  })
  return {
    set, dim, done: p.done,
    is: (x: number, y: number, cols: string[]) => on(x, y) && cols.some(c => u32(c) === p.u[y * W + x]),
    art(rows: string[], x: number, y: number, key: Key, flip = false) {
      each(rows, x, y, flip, (px, py, ch) => key[ch] && set(px, py, key[ch]))
    },
    cast(rows: string[], x: number, y: number, dx: number, dy: number, flip = false) {
      each(rows, x + dx, y + dy, flip, dim)
    },
  }
}

export type Board = ReturnType<typeof board>
