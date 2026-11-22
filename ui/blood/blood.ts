import type { Ctx } from '../../core/screen/canvas'
import { FOREST as C, UI } from '../../data/look/palette'
import { drop } from '../parts/icons'
import { text, width } from '../text/text'

export function blood(g: Ctx, n: number, exact = false, bonus = 0, left = 0) {
  const shown = String(exact ? +n.toFixed(2) : Math.floor(n)), x = 24 + width(shown), tall = Math.ceil(9 * left)
  for (let i = 0; i < 9; i++) drop(g, 15 + i % 3, 14 + (i / 3 | 0), UI.panel)
  drop(g, 16, 15, C.red)
  text(g, shown, 24, 19, UI.text, undefined, UI.panel)
  if (left <= 0 || !bonus) return
  text(g, 'x' + (1 + bonus).toFixed(1), x + 8, 19, UI.gold, undefined, UI.panel)
  g.fillStyle = UI.panel
  g.fillRect(x + 28, 10, 4, 11)
  g.fillStyle = UI.gold
  g.fillRect(x + 29, 20 - tall, 2, tall)
}
