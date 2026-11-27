import { WING } from '../../data/dragonfly/colors'
import { FOREST as C } from '../../data/look/palette'
import { BUGS } from './bugs'
import { bands, INK, line, oval, pair, type Dot } from './strokes'

export const SHAPES: Record<string, (dot: Dot, f: number, t: number) => void> = {
  mayfly(dot, f) {
    pair(s => line(dot, -3, s * .3, -9, s * 2.2, '#f1ecc4', true))
    if (f) pair(s => oval(dot, 1.2, s * (1 + 3 * f), 1.7, 3 * f, WING.fill, true))
    oval(dot, 0, 0, 3.5, .8, '#e8dc8a')
    dot(3.5, 0, INK)
  },
  ladybug(dot, f) {
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
  ...BUGS,
}
