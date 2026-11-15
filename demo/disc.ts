import { UI } from '../data/look/palette'
import { blend, chip, type Display } from './chip'

const R = 5.4
let turn = 0, wave = 1

export const disc: Display = (lo, hi, right, name, s, dt) => {
  const cx = chip(lo, right, name, R * 2) + R, cy = 16
  turn += dt * 3.46 * (.25 + .75 * Math.min(1, s.level * 4))
  wave = s.hit > .3 ? 0 : Math.min(1, wave + dt * 2.2)
  hi.fillStyle = UI.line
  hi.beginPath()
  hi.arc(cx, cy, R, 0, 7)
  hi.fill()
  hi.lineWidth = .35
  hi.strokeStyle = UI.panel
  for (const r of [2.9, 3.7, 4.5]) {
    hi.beginPath()
    hi.arc(cx, cy, r, 0, 7)
    hi.stroke()
  }
  hi.fillStyle = UI.text
  hi.globalAlpha = .2
  for (const a of [turn, turn + Math.PI]) {
    hi.beginPath()
    hi.moveTo(cx, cy)
    hi.arc(cx, cy, R, a, a + .5)
    hi.fill()
  }
  hi.globalAlpha = 1 - wave
  hi.strokeStyle = UI.accent
  hi.lineWidth = .6
  hi.beginPath()
  hi.arc(cx, cy, 2 + wave * (R - 2), 0, 7)
  hi.stroke()
  hi.globalAlpha = 1
  hi.fillStyle = blend(UI.accent, UI.text, s.pulse * .5)
  hi.beginPath()
  hi.arc(cx, cy, 1.9 + s.pulse * .5, 0, 7)
  hi.fill()
  hi.fillStyle = UI.panel
  hi.beginPath()
  hi.arc(cx, cy, .5, 0, 7)
  hi.fill()
}
