import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { text, width } from '../text/text'

export function banner(g: Ctx, title: string, lines: string[], u: number, hold: number) {
  const half = width(title) + 8
  g.globalAlpha = clamp(Math.min(u / .25, (hold - u) / .4))
  text(g, title, W / 2, 72, UI.gold, 'c', UI.panel, 2)
  lines.forEach((line, i) => text(g, line, W / 2, 88 + i * 12, UI.text, 'c', UI.panel))
  for (const s of [-1, 1]) for (const [col, y] of [[UI.panel, 66], [UI.gold, 65]] as const) {
    g.fillStyle = col
    g.fillRect(W / 2 + s * half + (s < 0 ? -36 : 0), y, 36, 1)
  }
  g.globalAlpha = 1
}
