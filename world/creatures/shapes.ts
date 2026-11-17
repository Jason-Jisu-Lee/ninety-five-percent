import { WING } from '../../data/dragonfly/colors'
import { FOREST as C } from '../../data/look/palette'

export type Dot = (along: number, across: number, col: string, thin?: boolean) => void
type Paint = string | ((a: number, c: number) => string)

const INK = WING.stigma, BLUE = '#4fc3e8'

function oval(dot: Dot, a0: number, c0: number, ra: number, rc: number, col: Paint, thin = false) {
  for (let a = -ra; a <= ra; a += .5) for (let c = -rc; c <= rc; c += .5)
    if ((a / Math.max(.4, ra)) ** 2 + (c / Math.max(.4, rc)) ** 2 <= 1) dot(a0 + a, c0 + c, typeof col === 'string' ? col : col(a0 + a, c0 + c), thin)
}

function line(dot: Dot, a0: number, c0: number, a1: number, c1: number, col: string, thin = false) {
  const n = Math.ceil(Math.hypot(a1 - a0, c1 - c0) * 2)
  for (let i = 0; i <= n; i++) dot(a0 + (a1 - a0) * i / n, c0 + (c1 - c0) * i / n, col, thin)
}

const pair = (draw: (s: number) => void) => [-1, 1].forEach(draw)
const bands = (one: string, two: string, wide: number) => (a: number) => Math.floor((a + 20) / wide) & 1 ? one : two

export const SHAPES: Record<string, (dot: Dot, f: number, t: number) => void> = {
  mayfly(dot, f) {
    pair(s => line(dot, -3, s * .3, -9, s * 2.2, '#f1ecc4', true))
    if (f) pair(s => oval(dot, 1.2, s * (1 + 3 * f), 1.7, 3 * f, WING.fill, true))
    oval(dot, 0, 0, 3.5, .8, '#e8dc8a')
    dot(3.5, 0, INK)
  },
  ladybird(dot, f) {
    if (f > .35) pair(s => oval(dot, -1, s * (2 + 2.5 * f), 1.6, 2.5 * f, WING.fill, true))
    oval(dot, 0, 0, 2.6, 2.4, C.red)
    oval(dot, 2.4, 0, .8, 1.5, INK)
    line(dot, -2.5, 0, 1.6, 0, INK)
    pair(s => [[.6, 1.3], [-1.2, 1]].forEach(([a, c]) => dot(a, s * c, INK)))
  },
  bumblebee(dot, f) {
    if (f) pair(s => oval(dot, .8, s * (2 + 2 * f), 1.3, 2 * f, WING.fill, true))
    oval(dot, 0, 0, 3.6, 2.3, a => a < -2.6 ? C.white : bands(INK, C.yellow, 1.5)(a))
    oval(dot, 3.4, 0, .8, 1.3, INK)
  },
  wasp(dot, f) {
    if (f) pair(s => {
      line(dot, 1.5, s, -2.5, s * (1.5 + 4.5 * f), C.husk, true)
      line(dot, 1, s, -3, s * (1 + 4 * f), C.husk, true)
    })
    oval(dot, -3, 0, 2.8, 1.4, bands(C.yellow, INK, 1.2))
    dot(-.2, 0, INK)
    oval(dot, 1.5, 0, 1.4, 1.3, INK)
    oval(dot, 3.6, 0, .9, 1.2, C.yellow)
    dot(-6, 0, INK)
  },
  cranefly(dot, f) {
    pair(s => [[2, 5, 7], [0, -1, 9], [-1, -6, 7]].forEach(([a, b, c]) => line(dot, a, s * .5, b, s * c, C.t1, true)))
    if (f) pair(s => {
      line(dot, 1.5, s, .5, s * (1 + 6 * f), WING.fill, true)
      line(dot, 1, s, -.2, s * (1 + 5 * f), WING.fill, true)
    })
    line(dot, -4, 0, 3, 0, C.t0)
    dot(3.5, 0, INK)
  },
  damselfly(dot, f) {
    if (f) pair(s => {
      line(dot, 3.5, s, 1, s * (1 + 6 * f), WING.fill, true)
      line(dot, 3, s, -.5, s * (1 + 5.5 * f), WING.fill, true)
    })
    line(dot, -7, 0, 4, 0, BLUE)
    for (const a of [-5, -3, -1]) dot(a, 0, INK)
    oval(dot, 4, 0, 1, .8, BLUE)
    pair(s => dot(5.2, s * 1.2, INK))
  },
  lacewing(dot, f) {
    pair(s => line(dot, 3, s * .3, 6.5, s * 2.2, C.g3, true))
    if (f) pair(s => oval(dot, -1, s * (.8 + 2.6 * f), 4, 2.6 * f, (a, c) => (Math.round(a * 2) + Math.round(c * 2)) % 3 ? '#c9efb8' : '#8fd07a', true))
    line(dot, -3, 0, 3, 0, '#58b84a')
    pair(s => dot(3.2, s * .8, C.husk))
  },
  firefly(dot, f, t) {
    const lit = Math.sin(t * 3) > -.2
    if (f) pair(s => oval(dot, 0, s * (1.5 + 2 * f), 1.3, 2 * f, WING.fill, true))
    oval(dot, 0, 0, 3, 1.4, INK)
    oval(dot, 2.6, 0, .9, 1.3, '#e8843a')
    oval(dot, -3, 0, lit ? 1.8 : 1, lit ? 1.8 : 1, lit ? '#e6ff7a' : '#8a9a3a')
  },
  whitebutterfly(dot, f) {
    if (f) pair(s => {
      oval(dot, 1.6, s * (.6 + 4 * f), 2.8, 4 * f, (a, c) => a > 2.6 && Math.abs(c) > 4.5 * f ? INK : C.white, true)
      oval(dot, -2, s * (.6 + 3 * f), 2.2, 3 * f, '#e2dcc6', true)
    })
    line(dot, -3, 0, 3, 0, INK)
  },
  junebeetle(dot, f) {
    if (f > .35) pair(s => oval(dot, -1, s * (2.5 + 3.5 * f), 2, 3.5 * f, C.husk, true))
    oval(dot, -.5, 0, 4, 3, C.t0)
    line(dot, -4, 0, 2, 0, C.t1)
    oval(dot, 3.6, 0, 1.2, 1.8, C.t2)
    pair(s => line(dot, -2, s * 1.6, 1, s * 1.6, '#a5774e'))
  },
}
