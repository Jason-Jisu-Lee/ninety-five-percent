import { level } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { UPGRADES } from '../../data/shop/upgrades'
import { text } from '../text/text'
import { wrap } from '../text/wrap'

export function about(g: Ctx, pick: { name: string; text: string }, x: number, wide: number) {
  const at = UPGRADES[pick.name], inborn = /^passive\. /.test(pick.text), lines = pick.text.replace(/^passive\. /, '').split('. ').concat(at ? [`Level ${level(pick.name)} of ${at[2].length}`] : [])
  text(g, pick.name, x, 238, UI.gold)
  if (inborn) text(g, 'Passive', x, 250, UI.ally)
  lines.flatMap(s => wrap(s.charAt(0).toUpperCase() + s.slice(1), wide)).forEach((line, i) => text(g, line, x, 254 + +inborn * 12 + i * 11, UI.text))
}
