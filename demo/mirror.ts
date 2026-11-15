import { UI } from '../data/look/palette'
import { blend, chip, type Display } from './chip'
import { ease, group } from './hear'

const HALF = 6, PITCH = 2, half = Array<number>(HALF + 1).fill(0)

export const mirror: Display = (lo, hi, right, name, s, dt, k) => {
  const x = chip(lo, right, name, HALF * 2 * PITCH + 1.2)
  group(s, HALF + 1).forEach((want, i) => half[i] = ease(half[i], want, dt, 34, 8))
  hi.lineCap = 'round'
  hi.lineWidth = 1.2
  hi.shadowColor = UI.accent
  hi.shadowBlur = k * s.pulse * 2
  hi.strokeStyle = blend(UI.accent, UI.text, s.pulse * .5)
  for (let i = -HALF; i <= HALF; i++) {
    const far = Math.abs(i), reach = .35 + half[far] * (4.7 - far * .32) * (1 + s.pulse * .15), cx = x + .6 + (i + HALF) * PITCH
    hi.globalAlpha = 1 - far * .09
    hi.beginPath()
    hi.moveTo(cx, 16 - reach)
    hi.lineTo(cx, 16 + reach)
    hi.stroke()
  }
  hi.shadowBlur = 0
  hi.globalAlpha = 1
}
