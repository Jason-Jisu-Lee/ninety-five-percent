import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H } from '../../data/look/screen'
import { gain } from '../blood/gain'
import { gem, orb } from '../parts/icons'
import { text, width } from '../text/text'

const change = gain()

export function head(g: Ctx, name: string, side: number, L: number, R: number) {
  const n = String(Math.round(side ? save.points : save.blood))
  text(g, name, L, 38, UI.text, undefined, undefined, 2)
  text(g, n, R, 38, side ? UI.gold : UI.text, 'r', undefined, 2)
  if (side) gem(g, R - width(n) * 2 - 9, 31, UI.gold)
  else orb(g, R - width(n) * 2 - 8, 31), change(g, save.blood, R - width(n) * 2 - 16, 36, 'r')
  g.fillStyle = UI.line
  g.fillRect(L, 48, R - L, 1)
  g.fillRect(L, H - 52, R - L, 1)
}
