import { ease, group, sound } from '../../audio/player/hear'
import { UI } from '../../data/look/palette'
import type { Display } from './track'

const N = 5, tall = Array<number>(N).fill(0), cap = Array<number>(N).fill(0), hold = Array<number>(N).fill(0)

export const grid: Display = {
  wide: N * 3 - 1,
  step(dt) {
    group(N).forEach((want, i) => {
      tall[i] = ease(tall[i], want, dt, 40, 9)
      if (tall[i] >= cap[i]) [cap[i], hold[i]] = [tall[i], .3]
      else if ((hold[i] -= dt) < 0) cap[i] = Math.max(tall[i], cap[i] - dt * 1.2)
    })
  },
  low(g, x) {
    tall.forEach((v, i) => {
      const h = 1 + Math.round(v * 9)
      g.fillStyle = sound.pulse > .5 ? UI.text : UI.accent
      g.fillRect(x + i * 3, 22 - h, 2, h)
      g.fillStyle = UI.text
      g.fillRect(x + i * 3, 20 - Math.round(cap[i] * 9), 2, 1)
    })
  },
}
