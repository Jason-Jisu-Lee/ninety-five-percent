import { ease, group, sound } from '../../audio/player/hear'
import { blend } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import type { Display } from './track'

const N = 4, PITCH = 3.5, tall = Array<number>(N).fill(0)

export const bars: Display = {
  wide: (N - 1) * PITCH + 2,
  step(dt) {
    group(N).forEach((want, i) => tall[i] = ease(tall[i], want, dt))
  },
  high(g, x, k) {
    g.lineCap = 'round'
    g.lineWidth = 2
    g.strokeStyle = blend(UI.accent, UI.text, sound.pulse * .55)
    g.shadowColor = UI.accent
    g.shadowBlur = k * (.6 + sound.pulse * 2.4)
    tall.forEach((h, i) => {
      g.beginPath()
      g.moveTo(x + 1 + i * PITCH, 21)
      g.lineTo(x + 1 + i * PITCH, 20.6 - h * 8.2 * (1 + sound.pulse * .12))
      g.stroke()
    })
  },
}
