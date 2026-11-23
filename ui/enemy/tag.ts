import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { PREY } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import type { Prey } from '../../world/creatures/prey'
import { LIFE } from '../parts/bar'
import { key } from '../parts/key'
import { box } from '../parts/panel'
import { text, width } from '../text/text'
import { tone } from './tone'

export function tag(g: Ctx, p: Prey, reach: number, under: boolean) {
  const k = PREY[p.kind], w = Math.max(width(k.name), 22) + 10, x = clamp(Math.round(p.x - w / 2), 2, W - w - 2), py = Math.round(p.y - p.h * .7)
  const y = Math.min(H - 21, under || py - reach - 23 < 28 ? py + reach + 5 : py - reach - 23), at = x + w + 13 < W ? x + w + 2 : x - 13, bx = x + (w - LIFE >> 1)
  box(g, x, y, w, 19, UI.border, UI.panel)
  text(g, k.name, x + w / 2, y + 11, tone(p.kind), 'c')
  g.fillStyle = UI.line
  g.fillRect(bx, y + 14, LIFE, 2)
  g.fillStyle = UI.foe
  g.fillRect(bx, y + 14, Math.ceil(LIFE * clamp(p.hp / k.hp)), 2)
  key(g, at, y + 3)
}
