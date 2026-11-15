import { UI } from '../data/look/palette'
import { blend, chip, type Display } from './chip'
import { ease, group } from './hear'

const N = 4, PITCH = 3.5, tall = Array<number>(N).fill(0)

export const bars: Display = (lo, hi, right, name, s, dt, k) => {
  const x = chip(lo, right, name, (N - 1) * PITCH + 2)
  hi.lineCap = 'round'
  hi.lineWidth = 2
  hi.strokeStyle = blend(UI.accent, UI.text, s.pulse * .55)
  hi.shadowColor = UI.accent
  hi.shadowBlur = k * (.6 + s.pulse * 2.4)
  group(s, N).forEach((want, i) => {
    tall[i] = ease(tall[i], want, dt)
    hi.beginPath()
    hi.moveTo(x + 1 + i * PITCH, 21)
    hi.lineTo(x + 1 + i * PITCH, 20.6 - tall[i] * 8.2 * (1 + s.pulse * .12))
    hi.stroke()
  })
  hi.shadowBlur = 0
}
