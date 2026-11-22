import { WING } from '../../data/dragonfly/colors'

export type Dot = (along: number, across: number, col: string, thin?: boolean) => void
type Paint = string | ((a: number, c: number) => string)

export const INK = WING.stigma, BLUE = '#4fc3e8'

export function oval(dot: Dot, a0: number, c0: number, ra: number, rc: number, col: Paint, thin = false) {
  for (let a = -ra; a <= ra; a += .5) for (let c = -rc; c <= rc; c += .5)
    if ((a / Math.max(.4, ra)) ** 2 + (c / Math.max(.4, rc)) ** 2 <= 1) dot(a0 + a, c0 + c, typeof col === 'string' ? col : col(a0 + a, c0 + c), thin)
}

export function line(dot: Dot, a0: number, c0: number, a1: number, c1: number, col: string, thin = false) {
  const n = Math.ceil(Math.hypot(a1 - a0, c1 - c0) * 2)
  for (let i = 0; i <= n; i++) dot(a0 + (a1 - a0) * i / n, c0 + (c1 - c0) * i / n, col, thin)
}

export const pair = (draw: (s: number) => void) => [-1, 1].forEach(draw)
export const bands = (one: string, two: string, wide: number) => (a: number) => Math.floor((a + 20) / wide) & 1 ? one : two
