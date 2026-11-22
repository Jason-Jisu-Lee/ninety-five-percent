import type { Board, Key } from './board'

type Blade = [dx: number, dy: number, tall: number, every: number, bend: number, head?: number]

const HEAD = ['.jih', 'jiih', 'jiih', 'jiih', 'jiih', 'jiih', 'jiih', 'jiih', 'jiih', 'jiih', 'jihh', '.ih.'], SMALL = ['jih', 'jih', 'jih', 'jih', 'jih', 'jih', '.h.']

export const STAND: Blade[][] = [
  [[-15, 0, 26, -4, 12], [-10, -2, 44, -7, 28], [-6, 1, 60, 0, 0, 1], [-2, -1, 52, -9, 36], [1, 2, 70, 0, 0, 1], [5, -1, 48, 8, 32], [9, 1, 54, 0, 0, 1], [12, -2, 38, 6, 22], [17, 0, 24, 4, 10]],
  [[-11, 0, 24, -4, 10], [-6, -1, 40, -7, 24], [-2, 1, 56, 0, 0, 1], [2, -1, 44, 8, 28], [6, 1, 46, 0, 0, 1], [11, 0, 26, 4, 12]],
  [[-8, 0, 20, -4, 8], [-4, -1, 34, -7, 20], [0, 1, 40, 0, 0], [3, -1, 30, 7, 18], [8, 0, 18, 4, 8]],
]
export const TUFT: Blade[][] = [
  [[-5, 0, 6, -2, 9], [-2, 0, 9, -4, 9], [1, 0, 11, 0, 0], [3, 0, 8, 3, 9], [6, 0, 6, 2, 9]],
  [[-3, 0, 7, -2, 9], [0, 0, 10, 0, 0], [3, 0, 7, 2, 9]],
  [[-6, 0, 5, -2, 9], [-3, 0, 8, -3, 9], [0, 0, 10, 5, 9], [3, 0, 7, 2, 9], [6, 0, 5, 1, 9]],
]

export function blades(b: Board, set: Blade[], x: number, y: number, k: Key, flip = false, scale = 1) {
  const fat = scale > .8 && set[0][2] > 12
  for (const [dx, dy, t, every, bend, head] of [...set].sort((p, q) => p[1] - q[1])) {
    const tall = Math.round(t * scale), bx = x + Math.round((flip ? -dx : dx) * (fat ? 1 : Math.max(.7, scale))), dir = Math.sign(every) * (flip ? -1 : 1), n = Math.abs(every) || 1e9, turn = Math.round(bend * scale)
    const lean = (i: number) => dir * (Math.floor(Math.min(i, turn) / n) + (i > turn ? Math.floor((i - turn) / Math.max(2, n >> 1)) : 0))
    for (let i = 0; i < tall; i++) {
      const w = head ? i > tall - 5 ? 1 : 2 : i > tall - 3 ? 1 : fat && i < tall * .7 ? 3 : 2, px = bx + lean(i) - (w === 1 && dir < 0 ? -1 : 0)
      for (let j = 0; j < w; j++) b.set(px + j, y + dy - i, k[head ? j ? '5' : '6' : i < 2 ? '5' : w === 1 ? '8' : j === w - 1 ? '5' : j || w < 3 ? '6' : '7'])
    }
    if (head) b.art(fat ? HEAD : SMALL, bx - 1, y + dy - tall + (fat ? 5 : 4), k)
  }
}

export function pool(b: Board, x: number, y: number, rx: number) {
  for (let j = -2; j <= 3; j++) for (let i = -rx + Math.abs(j - .5 | 0); i <= rx - Math.abs(j - .5 | 0); i++) b.dim(x + i + 2, y + j + 2)
}
