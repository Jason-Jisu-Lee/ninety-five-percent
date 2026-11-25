import { sound } from '../../audio/player/sound'
import { save } from '../../core/save/save'
import { pack } from '../../core/save/wild'
import type { Ctx } from '../../core/screen/canvas'
import { PREY } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { WILD, type Wild } from '../../data/shop/wild'
import { info } from '../enemy/card'
import { DW } from '../parts/details'
import { frame } from '../parts/frame'
import { orb } from '../parts/icons'
import { text, width } from '../text/text'

const TALL = 15, PITCH = 17, HIDE = '?????'
const label = (w: Wild) => w.kind ? w.name : 'Expansion: ' + w.name
const WIDE = Math.max(...WILD.map(w => width(label(w)) + width(String(w.cost)))) + 30, X = W - 8 - WIDE, Y = H - 8 - TALL - PITCH

export const SLOTS = [X, Y, WIDE, TALL + PITCH]

function slot(g: Ctx, name: string, cost: number, y: number, ink: string, pay: string, lit = false) {
  const p = String(cost)
  frame(g, X, y, WIDE, TALL, lit)
  text(g, name, X + 6, y + 11, ink)
  text(g, p, X + WIDE - 6, y + 11, pay, 'r')
  orb(g, X + WIDE - 11 - width(p), y + 7, pay === UI.dim ? UI.dim : '')
}

export function nextWild(buy: () => void) {
  let hot = false
  const now = () => save.fed ? WILD[pack.got] : undefined, can = () => save.blood >= (now()?.cost ?? Infinity)
  const on = (x: number, y: number, rows: number) => x >= X && x < X + WIDE && y >= Y && y < Y + TALL + PITCH * (rows - 1)
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
      slot(g, label(w), w.cost, Y, hot && can() ? UI.gold : UI.text, can() ? UI.text : UI.dim, can())
      if (after) slot(g, HIDE, after.cost, Y + PITCH, UI.dim, UI.dim)
      if (hot && w.kind) info(g, w.kind, PREY[w.kind].hp, t => [W - 8 - DW, Y - 6 - t])
    },
  }
}
