import { UI } from '../data/look/palette'
import { chip, type Display } from './chip'
import { ease, group } from './hear'

const N = 5, tall = Array<number>(N).fill(0), cap = Array<number>(N).fill(0), hold = Array<number>(N).fill(0)

export const grid: Display = (lo, _hi, right, name, s, dt) => {
  const x = chip(lo, right, name, N * 3 - 1)
  group(s, N).forEach((want, i) => {
    tall[i] = ease(tall[i], want, dt, 40, 9)
    if (tall[i] >= cap[i]) [cap[i], hold[i]] = [tall[i], .3]
    else if ((hold[i] -= dt) < 0) cap[i] = Math.max(tall[i], cap[i] - dt * 1.2)
    const h = 1 + Math.round(tall[i] * 9)
    lo.fillStyle = s.pulse > .5 ? UI.text : UI.accent
    lo.fillRect(x + i * 3, 22 - h, 2, h)
    lo.fillStyle = UI.text
    lo.fillRect(x + i * 3, 20 - Math.round(cap[i] * 9), 2, 1)
  })
}
