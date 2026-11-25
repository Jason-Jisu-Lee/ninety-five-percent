import { sound } from '../../audio/player/sound'
import { save } from '../../core/save/save'
import { pack } from '../../core/save/wild'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { WILD, type Wild } from '../../data/shop/wild'
import { foe } from '../enemy/card'
import { details, DW } from '../parts/details'
import { width } from '../text/text'
import { slot, tag, TALL } from './slot'

const DROP = 26, LIFT = 25, HIDE = '?????'
const label = (w: Wild) => w.kind ? w.name : 'Expansion: ' + w.name
const WIDE = Math.max(...WILD.map(w => width(label(w)) + width(String(w.cost)))) + 30, X = W - 8 - WIDE, Y = H - 38

export const SLOTS = [X, Y, WIDE, 30]

export function nextWild(buy: () => void) {
  let hot = false
  const now = () => save.fed ? WILD[pack.got] : undefined, can = () => save.blood >= (now()?.cost ?? Infinity)
  const on = (x: number, y: number, rows: number) => x >= X && x < X + WIDE && y >= Y && y < Y + (rows > 1 ? 30 : TALL)
  return {
    hover(x: number, y: number) {
      const was = hot
      hot = !!now() && on(x, y, 1)
      if (hot && !was) sound('tap')
      return hot && can()
    },
    click(x: number, y: number) {
      if (!now()) return false
      if (on(x, y, 1)) buy()
      return on(x, y, WILD[pack.got + 1] ? 2 : 1)
    },
    draw(g: Ctx) {
      const w = now(), after = WILD[pack.got + 1]
      if (!w) return
      slot(g, label(w), w.cost, X, Y, WIDE, can(), hot)
      if (after) tag(g, HIDE, after.cost, X, Y + DROP, WIDE, UI.dim, UI.dim, UI.panel)
      if (hot && w.kind) details(g, foe(w.kind), t => [W - 8 - DW, Y - LIFT - t])
    },
  }
}
