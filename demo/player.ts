import { UI } from '../data/look/palette'
import { width } from '../ui/text/text'
import { blend, chip, type Display } from './chip'
import { ease, group } from './hear'

const N = 3, PITCH = 2.6, LINE = 22.4, tall = Array<number>(N).fill(0)

export const player: Display = (lo, hi, right, name, s, dt) => {
  const x = chip(lo, right, name, (N - 1) * PITCH + 1.4, 2), end = right - 5, from = end - width(name), head = from + (end - from) * s.at
  hi.lineCap = 'round'
  hi.lineWidth = 1.4
  hi.strokeStyle = blend(UI.accent, UI.text, s.pulse * .5)
  group(s, N).forEach((want, i) => {
    tall[i] = ease(tall[i], want, dt)
    hi.beginPath()
    hi.moveTo(x + .7 + i * PITCH, 21.6)
    hi.lineTo(x + .7 + i * PITCH, 21.2 - tall[i] * 8)
    hi.stroke()
  })
  hi.lineWidth = .7
  for (const [to, ink] of [[end, UI.line], [head, UI.accent]] as const) {
    hi.strokeStyle = ink
    hi.beginPath()
    hi.moveTo(from, LINE)
    hi.lineTo(to, LINE)
    hi.stroke()
  }
  hi.fillStyle = UI.text
  hi.beginPath()
  hi.arc(head, LINE, .9 + s.pulse * .7, 0, 7)
  hi.fill()
}
