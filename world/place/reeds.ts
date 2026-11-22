import type { Board, Key } from './board'

type Blade = [dx: number, dy: number, tall: number, lean: number, droop: number, head?: number]

const HEAD = ['.jih', 'jiih', 'jiih', 'jiih', 'jiih', 'jiih', 'jiih', 'jiih', 'jiih', 'jiih', 'jihh', '.ih.'], SMALL = ['jih', 'jih', 'jih', 'jih', 'jih', 'jih', '.h.']

export const STAND: Blade[][] = [
  [[-15, 0, 26, -5, -8], [-10, -2, 44, -4, -12], [-6, 1, 60, 0, 0, 1], [-2, -1, 52, -2, -9], [1, 2, 70, 1, 0, 1], [5, -1, 48, 2, 10], [9, 1, 54, 0, 0, 1], [12, -2, 38, 4, 11], [17, 0, 24, 5, 8]],
  [[-11, 0, 24, -4, -8], [-6, -1, 40, -3, -11], [-2, 1, 56, 0, 0, 1], [2, -1, 44, 2, 10], [6, 1, 46, 1, 0, 1], [11, 0, 26, 4, 8]],
  [[-8, 0, 20, -4, -6], [-4, -1, 34, -3, -10], [0, 1, 40, 0, 2], [3, -1, 30, 2, 9], [8, 0, 18, 4, 6]],
]
export const TUFT: Blade[][] = [
  [[-5, 0, 6, -2, -2], [-2, 0, 9, -1, -2], [1, 0, 11, 0, 0], [3, 0, 8, 1, 2], [6, 0, 6, 2, 2]],
  [[-3, 0, 7, -2, -1], [0, 0, 10, 0, 1], [3, 0, 7, 2, 1]],
  [[-6, 0, 5, -2, -1], [-3, 0, 8, -1, -2], [0, 0, 10, 1, 2], [3, 0, 7, 1, 2], [6, 0, 5, 2, 1]],
]

const fat = (set: Blade[], scale: number) => scale > .8 && set[0][2] > 12
const base = (set: Blade[], dx: number, x: number, flip: boolean, scale: number) => x + Math.round((flip ? -dx : dx) * (fat(set, scale) ? 1 : Math.max(.7, scale)))

export const heads = (set: Blade[], x: number, y: number, flip: boolean, scale: number) =>
  set.filter(b => b[5]).map(([dx, dy, t]) => ({ x: base(set, dx, x, flip, scale), y: y + dy, h: (Math.round(t * scale) - 5) / .7 }))

export function blades(b: Board, set: Blade[], x: number, y: number, k: Key, flip = false, scale = 1) {
  const big = fat(set, scale)
  for (const [dx, dy, t, lean, droop, head] of [...set].sort((p, q) => p[1] - q[1])) {
    const tall = Math.round(t * scale), bx = base(set, dx, x, flip, scale), dir = flip ? -1 : 1
    const off = (i: number) => Math.round(dir * (lean * i / tall + droop * scale * (i / tall) ** 2))
    for (let i = 0; i < tall; i++) {
      const w = head ? i > tall - 5 ? 1 : 2 : i > tall * .86 ? 1 : big && i < tall * .55 ? 3 : 2, a = Math.min(off(i), off(Math.max(0, i - 1))), z = Math.max(off(i), off(Math.max(0, i - 1))) + w - 1
      for (let j = a; j <= z; j++) b.set(bx + j, y + dy - i, k[head ? j > a ? '5' : '6' : i < 2 ? '5' : w === 1 ? i > tall - 3 ? '8' : '7' : j === z ? '5' : j > a || w < 3 ? '6' : '7'])
    }
    if (head) b.art(big ? HEAD : SMALL, bx - 1, y + dy - tall + (big ? 5 : 4), k)
  }
}

export function pool(b: Board, x: number, y: number, rx: number) {
  for (let j = -2; j <= 3; j++) for (let i = -rx + Math.abs(j - .5 | 0); i <= rx - Math.abs(j - .5 | 0); i++) b.dim(x + i + 2, y + j + 2)
}
