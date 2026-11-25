import { num } from '../../core/math/num'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { orb } from '../parts/icons'
import { text, width } from '../text/text'

export function blood(g: Ctx, n: number, exact = false, bonus = 0, left = 0, lit = false) {
  const shown = exact ? num(n) : String(Math.floor(n)), x = 24 + width(shown), tall = Math.ceil(9 * left)
  orb(g, 16, 15, '', UI.panel)
  text(g, shown, 24, 19, lit ? UI.gold : UI.text, undefined, UI.panel)
  if (left <= 0 || !bonus) return x
  text(g, 'x' + (1 + bonus).toFixed(1), x + 8, 19, UI.gold, undefined, UI.panel)
  g.fillStyle = UI.panel
  g.fillRect(x + 28, 10, 4, 11)
  g.fillStyle = UI.gold
  g.fillRect(x + 29, 20 - tall, 2, tall)
  return x + 32
}
