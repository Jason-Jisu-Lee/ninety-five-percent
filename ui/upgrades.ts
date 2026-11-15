import type { Ctx } from '../core/canvas'
import { buy, save } from '../core/save'
import { FOREST as C, UI } from '../data/palette'
import { cost, gain, NAMES, STATS } from '../data/stats'
import { gem, icon } from './icons'
import { box } from './panel'
import { text, width } from './text'

const X = 8, Y = 30, P = 16, BX = 68, BW = 38, TX = 66, TY = 8, TS = 15

export function upgrades() {
  let open = true, hot = -1, tab = false
  const row = (x: number, y: number) => open && x >= X && x < BX + BW && y >= Y && y < Y + P * NAMES.length && (y - Y) % P < 14 ? (y - Y) / P | 0 : -1
  const onTab = (x: number, y: number) => x >= TX && x < TX + TS && y >= TY && y < TY + TS
  const can = (i: number) => save.energy >= cost(NAMES[i], save.lv[NAMES[i]])
  return {
    flip() {
      open = !open
    },
    hover(x: number, y: number) {
      hot = row(x, y)
      tab = onTab(x, y)
      return tab || hot >= 0 && x >= BX && can(hot)
    },
    click(x: number, y: number) {
      const i = row(x, y)
      if (onTab(x, y)) open = !open
      else if (i >= 0 && x >= BX) buy(NAMES[i])
      return i >= 0 || onTab(x, y)
    },
    draw(g: Ctx) {
      box(g, TX, TY, TS, TS, tab ? UI.accent : UI.border, UI.panel)
      icon(g, open ? 'down' : 'right', TX + (open ? 5 : 6), TY + (open ? 6 : 5), UI.text)
      if (!open) return
      NAMES.forEach((s, i) => {
        const y = Y + i * P, ok = can(i)
        text(g, STATS[s].name, X + 2, y + 11, UI.text, undefined, UI.panel)
        text(g, String(save.lv[s]), BX - 5, y + 11, UI.accent, 'r', UI.panel)
        box(g, BX, y, BW, 14, !ok ? UI.dim : i === hot ? UI.text : UI.accent, UI.panel)
        gem(g, BX + 7, y + 7, ok ? C.yellow : UI.dim)
        text(g, String(cost(s, save.lv[s])), BX + BW - 4, y + 11, ok ? UI.text : UI.dim, 'r')
      })
      if (hot < 0) return
      const lines = [STATS[NAMES[hot]].tip, gain(NAMES[hot])], x = BX + BW + 5, y = Y + hot * P - 1
      box(g, x, y, Math.max(...lines.map(l => width(l))) + 10, 29, UI.border, UI.panel)
      lines.forEach((l, i) => text(g, l, x + 5, y + 12 + i * 11, i ? UI.accent : UI.text))
    },
  }
}
