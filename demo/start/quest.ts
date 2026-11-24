import type { Ctx } from '../../core/screen/canvas'
import { QUESTS } from '../../data/game/quests'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { orb } from '../../ui/parts/icons'
import { text, width } from '../../ui/text/text'

const R = W - 8, BAR = 64

export function questAt(g: Ctx, got: number, dx = 0, dy = 0) {
  const q = QUESTS[0], r = R + dx, pay = '+' + q.blood, x = r - width(pay) - 14 - BAR
  text(g, q.text, r, 41 + dy, UI.text, 'r', UI.panel)
  g.fillStyle = UI.panel
  g.fillRect(x - 1, 47 + dy, BAR + 2, 6)
  g.fillStyle = UI.line
  g.fillRect(x, 48 + dy, BAR, 4)
  g.fillStyle = UI.accent
  g.fillRect(x, 48 + dy, Math.round(BAR * Math.min(1, got / q.n)), 4)
  text(g, pay, r, 54 + dy, UI.gold, 'r', UI.panel)
  orb(g, r - width(pay) - 6, 50 + dy, '', UI.panel)
  text(g, `${got} / ${q.n}`, x - 6, 54 + dy, UI.accent, 'r', UI.panel)
}
