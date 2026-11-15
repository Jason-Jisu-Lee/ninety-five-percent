import type { Ctx } from '../core/canvas'
import { save } from '../core/save'
import { UI } from '../data/palette'
import { NAMES, STATS } from '../data/stats'
import { box } from './panel'
import { text } from './text'

export function statCard(g: Ctx, x: number, y: number) {
  box(g, x, y, 62, NAMES.length * 11 + 7, UI.border, UI.panel)
  NAMES.forEach((s, i) => {
    text(g, STATS[s].name, x + 5, y + 13 + i * 11, UI.text)
    text(g, String(save.lv[s]), x + 57, y + 13 + i * 11, UI.accent, 'r')
  })
}
