import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { NEWS as N } from '../../data/game/hints'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { brackets } from '../parts/brackets'
import { text, width } from '../text/text'
import { SLOTS } from '../wild/next'

export function unlocked(g: Ctx, u: number) {
  const half = width(N.title) + 8
  brackets(g, SLOTS, 2 + Math.round(7 * (1 - Math.min(1, u % 1.2 / .4)) ** 2))
  g.globalAlpha = clamp(Math.min(u / .25, (N.hold - u) / .4))
  text(g, N.title, W / 2, 72, UI.gold, 'c', UI.panel, 2)
  N.lines.forEach((line, i) => text(g, line, W / 2, 88 + i * 12, UI.text, 'c', UI.panel))
  for (const s of [-1, 1]) for (const [col, y] of [[UI.panel, 66], [UI.gold, 65]] as const) {
    g.fillStyle = col
    g.fillRect(W / 2 + s * half + (s < 0 ? -36 : 0), y, 36, 1)
  }
  g.globalAlpha = 1
}
