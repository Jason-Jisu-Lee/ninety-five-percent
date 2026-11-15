import type { Ctx } from '../../core/screen/canvas'
import { gain, STATS, type Stat } from '../../data/dragonfly/stats'
import { UI } from '../../data/look/palette'
import { box } from '../parts/panel'
import { text, width } from '../text/text'

export function tip(g: Ctx, s: Stat, x: number, y: number) {
  const lines = [STATS[s].tip, gain(s)]
  box(g, x, y, Math.max(...lines.map(l => width(l))) + 10, 29, UI.border, UI.panel)
  lines.forEach((l, i) => text(g, l, x + 5, y + 12 + i * 11, i ? UI.accent : UI.text))
}
