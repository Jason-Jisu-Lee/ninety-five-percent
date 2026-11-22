import { WING } from '../../data/dragonfly/colors'
import { FOREST as C } from '../../data/look/palette'
import { BLUE, INK, line, oval, pair, type Dot } from './strokes'

export const BUGS: Record<string, (dot: Dot, f: number, t: number) => void> = {
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
