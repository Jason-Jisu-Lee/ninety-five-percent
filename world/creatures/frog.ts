import { WING } from '../../data/dragonfly/colors'
import type { Bug } from './draw'

type Dot = (along: number, across: number, col: string, thin?: boolean) => void

const LEGS = [[[-.3, .4], [-.1, .84], [-.5, .74], [-.62, 1]], [[.12, .42], [.28, .74]]]

export function frog(dot: Dot, k: Bug, t: number) {
  const L = k.len, half = k.wide / 2, blink = t % 4 > 3.85
  for (const side of [-1, 1]) for (const leg of LEGS) for (let i = 1; i < leg.length; i++) for (let u = 0; u <= 1; u += .12)
    dot((leg[i - 1][0] + (leg[i][0] - leg[i - 1][0]) * u) * L, side * (leg[i - 1][1] + (leg[i][1] - leg[i - 1][1]) * u) * k.wide, k.band, true)
  for (let a = -L * .5; a <= L * .46; a += .5) {
    const body = half * Math.sqrt(Math.max(0, 1 - ((a + L * .08) / (L * .44)) ** 2)), head = half * .8 * Math.sqrt(Math.max(0, 1 - ((a - L * .28) / (L * .2)) ** 2))
    for (let w = -Math.max(body, head); w <= Math.max(body, head); w += .5)
      dot(a, w, Math.round(a * 3 + Math.abs(w) * 5) % 7 < 1 && a < L * .2 ? k.band : k.body)
  }
  for (const side of [-1, 1]) {
    dot(L * .3, side * half * .62, blink ? k.band : k.eye)
    dot(L * .3 + 1, side * half * .62, blink ? k.band : WING.stigma)
  }
}
