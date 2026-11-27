import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { text } from '../text/text'
import { wrap } from '../text/wrap'

export const MANUAL = /^manual\. /

export function about(g: Ctx, pick: { name: string; text: string }, x: number, wide: number) {
  const manual = MANUAL.test(pick.text), lines = pick.text.replace(MANUAL, '').split('. ')
  text(g, pick.name, x, 238, UI.gold)
  if (manual) text(g, 'Manual', x, 250, UI.ally)
  lines.flatMap(s => wrap(s.charAt(0).toUpperCase() + s.slice(1), wide)).forEach((line, i) => text(g, line, x, 254 + +manual * 12 + i * 11, UI.text))
}
