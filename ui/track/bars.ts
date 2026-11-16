import { ease, group, sound } from '../../audio/player/hear'
import { blend, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'

const N = 4, PITCH = 3.5, tall = Array<number>(N).fill(0)

export const sway = (dt: number) => group(N).forEach((want, i) => tall[i] = ease(tall[i], want, dt))

export function bars(g: Ctx, x: number, k: number) {
  g.lineCap = 'round'
  g.shadowColor = UI.accent
  for (const [wide, col, blur] of [[4, UI.panel, 0], [2, blend(UI.accent, UI.text, sound.pulse * .55), k * (.6 + sound.pulse * 2.4)]] as const) {
    g.lineWidth = wide
    g.strokeStyle = col
    g.shadowBlur = blur
    tall.forEach((h, i) => {
      g.beginPath()
      g.moveTo(x + 1 + i * PITCH, 21)
      g.lineTo(x + 1 + i * PITCH, 20.6 - h * 8.2 * (1 + sound.pulse * .12))
      g.stroke()
    })
  }
}
