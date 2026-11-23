import type { Ctx } from '../../core/screen/canvas'
import { save } from '../../core/save/save'
import { UI } from '../../data/look/palette'
import { QUESTS } from '../../data/game/quests'
import { W } from '../../data/look/screen'
import { text } from '../text/text'

export function quest(g: Ctx) {
  const q = QUESTS[save.quest]
  if (!q) return
  text(g, q.text, W - 8, 41, UI.text, 'r', UI.panel)
  text(g, `${save.count} / ${q.n}`, W - 8, 53, UI.accent, 'r', UI.panel)
}
