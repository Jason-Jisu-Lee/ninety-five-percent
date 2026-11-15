import { UI } from '../data/look/palette'
import { chip, type Display } from './chip'
import { ease } from './hear'

const N = 14, PITCH = 1.6, BASE = 19.4, TALL = 8.6, tall = Array<number>(N).fill(0), cap = Array<number>(N).fill(0), hold = Array<number>(N).fill(0)

export const spectrum: Display = (lo, hi, right, name, s, dt) => {
  const x = chip(lo, right, name, (N - 1) * PITCH + 1), fade = hi.createLinearGradient(0, BASE, 0, BASE - TALL)
  fade.addColorStop(0, UI.accent)
  fade.addColorStop(1, UI.text)
  hi.lineCap = 'butt'
  hi.lineWidth = 1
  s.bands.forEach((want, i) => {
    const cx = x + .5 + i * PITCH
    tall[i] = ease(tall[i], want, dt, 40, 10)
    if (tall[i] >= cap[i]) [cap[i], hold[i]] = [tall[i], .28]
    else if ((hold[i] -= dt) < 0) cap[i] = Math.max(tall[i], cap[i] - dt * 1.1)
    for (const [from, to, alpha, ink] of [[BASE, BASE - .5 - tall[i] * TALL, 1, fade], [BASE + .8, BASE + 1 + tall[i] * 2.6, .22, UI.accent], [BASE - 1.3 - cap[i] * TALL, BASE - 1.9 - cap[i] * TALL, .9, UI.text]] as const) {
      hi.globalAlpha = alpha
      hi.strokeStyle = ink
      hi.beginPath()
      hi.moveTo(cx, from)
      hi.lineTo(cx, to)
      hi.stroke()
    }
  })
  hi.globalAlpha = 1
}
