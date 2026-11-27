import { level } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { FOREST, UI } from '../../data/look/palette'
import { UPGRADES } from '../../data/shop/upgrades'
import { frame } from '../parts/frame'
import { orb } from '../parts/icons'
import { text, width } from '../text/text'

export const CW = 184, CH = 17

export function row(g: Ctx, it: { name: string; off?: boolean }, x: number, y: number, hot: boolean, known: boolean, c: number | undefined, ok: boolean) {
  const p = String(c), n = level(it.name), of = UPGRADES[it.name]?.[2].length ?? 0
  frame(g, x, y, CW, CH, hot)
  g.fillStyle = FOREST.pink
  if (!known) g.fillRect(x, y, 2, CH)
  text(g, it.name, x + 7, y + 12, !known ? FOREST.pink : it.off || UPGRADES[it.name] && !c ? UI.dim : hot ? UI.gold : UI.text)
  if (n && of > 1) text(g, `${n}/${of}`, x + 12 + width(it.name), y + 12, UI.dim)
  if (!c) return
  text(g, p, x + CW - 7, y + 12, ok ? UI.text : UI.dim, 'r')
  orb(g, x + CW - 12 - width(p), y + 8, ok ? '' : UI.dim)
}
