import { sound } from '../../audio/player/sound'
import { save } from '../../core/save/save'
import { pack } from '../../core/save/wild'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { WILD, type Wild } from '../../data/shop/wild'
import { foe } from '../enemy/card'
import { details, DW } from '../parts/details'
import { orb } from '../parts/icons'
import { panel } from '../parts/panel'
import { text, width } from '../text/text'

const TALL = 15, DROP = 26, SEE = .84, HIDE = '?????'
const label = (w: Wild) => w.kind ? w.name : 'Expansion: ' + w.name
const WIDE = Math.max(...WILD.map(w => width(label(w)) + width(String(w.cost)))) + 30, X = W - 8 - WIDE, Y = H - 38

export const SLOTS = [X, Y, WIDE, 30]

function line(g: Ctx, name: string, cost: number, y: number, ink: string, pay: string, edge?: string) {
  const p = String(cost)
  text(g, name, X + 6, y, ink, undefined, edge)
  text(g, p, X + WIDE - 6, y, pay, 'r', edge)
  orb(g, X + WIDE - 11 - width(p), y - 4, pay === UI.dim ? UI.dim : '', edge)
}

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
      g.globalAlpha = SEE
      panel(g, X, Y, WIDE, TALL, can() ? hot ? UI.text : UI.gold : UI.line, UI.panel)
      g.globalAlpha = 1
      g.fillStyle = can() ? UI.gilt : UI.well
      g.fillRect(X + 2, Y + 2, Math.round((WIDE - 4) * Math.min(1, save.blood / w.cost)), TALL - 4)
      line(g, label(w), w.cost, Y + 11, can() ? UI.gold : UI.text, can() ? UI.text : UI.dim)
      if (after) line(g, HIDE, after.cost, Y + DROP, UI.dim, UI.dim, UI.panel)
      if (hot && w.kind) details(g, foe(w.kind), t => [W - 8 - DW, Y - 6 - t])
    },
  }
}
