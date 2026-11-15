import type { Ctx } from '../core/canvas'
import { save } from '../core/save'
import { UI } from '../data/palette'
import { QUESTS } from '../data/quests'
import { W } from '../data/screen'
import { text } from './text'

export function quest(g: Ctx) {
  const q = QUESTS[save.quest]
  if (!q) return
  text(g, q.text, W - 8, 41, UI.text, 'r', UI.panel)
  text(g, `${save.count} / ${q.n}`, W - 8, 53, UI.accent, 'r', UI.panel)
}
