import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { BIRD as B } from '../../data/game/bird'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { text, width } from '../text/text'

const Y = H - 22, FULL = width(B.line), LEFT = Math.round(W / 2 - FULL / 2), BOX = FULL + B.pad * 2

export function narrate(g: Ctx, t: number) {
  const u = t - B.say, a = clamp((B.shadow + B.pass + B.fade - t) / B.fade)
  if (u <= 0 || a <= 0) return
  g.globalAlpha = a * Math.min(1, u / .15) * B.dim
  g.fillStyle = B.box
  g.fillRect(W / 2 - BOX / 2 | 0, Y - 12, BOX, 17)
  g.globalAlpha = a
  text(g, B.line.slice(0, Math.floor(u / B.type * B.line.length)), LEFT, Y, UI.text)
  g.globalAlpha = 1
}
