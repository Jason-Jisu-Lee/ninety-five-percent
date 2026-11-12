import type { Ctx } from '../core/canvas'
import { UI } from '../data/palette'
import { bubbleIcon } from './bubble_icon'
import { text } from './text'

type Upgrade = { name: string; blurb: string; cost: number }

export function upgradeRow(g: Ctx, y: number, u: Upgrade, bubbles: number, lit: boolean) {
  if (lit) {
    g.fillStyle = '#181410'
    g.fillRect(778, y, 152, 36)
  }
  text(g, u.name, 786, y + 15, 12, lit ? UI.text : '#bdb5a6')
  text(g, u.blurb, 786, y + 29, 10, UI.dim)
  bubbleIcon(g, 906, y + 8)
  text(g, String(u.cost), 926, y + 15, 12, bubbles >= u.cost ? UI.accent : UI.dim, 'r')
}
