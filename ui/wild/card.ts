import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H } from '../../data/look/screen'
import { icon, orb } from '../parts/icons'
import { panel } from '../parts/panel'
import { text, width } from '../text/text'

export const PEEK = 28, RISE = 10, GAP = 4

export const tall = (lines: string[]) => PEEK + Math.max(0, lines.length - 1) * 11

export function card(g: Ctx, x: number, w: number, lines: string[], cost: number, can: boolean, hot: boolean) {
  const live = lines.length > 0, y = H - tall(lines) - +hot * RISE, p = String(cost), mid = x + (w >> 1), pay = can ? UI.text : UI.dim
  panel(g, x, y, w, tall(lines) + RISE + 4, live ? can ? hot ? UI.text : UI.gold : hot ? UI.border : UI.line : UI.line, UI.night)
  lines.forEach((line, i) => text(g, line, mid, y + 12 + i * 11, can ? UI.gold : UI.text, 'c'))
  if (!live) icon(g, 'lock', mid - 3, y + 5, UI.faint)
  text(g, p, mid + (width(p) + 8 >> 1), y + tall(lines) - 4, pay, 'r')
  orb(g, mid + (width(p) + 8 >> 1) - width(p) - 5, y + tall(lines) - 8, can ? '' : UI.dim)
  return y
}
