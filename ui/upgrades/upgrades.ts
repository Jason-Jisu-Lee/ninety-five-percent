import { buy, save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { cost, full, gain, NAMES, STATS } from '../../data/dragonfly/stats'
import { FOREST as C, UI } from '../../data/look/palette'
import { drop, icon } from '../parts/icons'
import { note } from '../parts/note'
import { box } from '../parts/panel'
import { text } from '../text/text'

const X = 8, Y = 30, P = 16, BX = 68, BW = 38, TX = 66, TY = 8, TS = 15

export function upgrades() {
  let open = true, hot = -1, tab = false, stuck: number[] | null = null
  const rows = () => NAMES.filter(s => !full(s, save.lv[s]))
  const row = (x: number, y: number) => open && x >= X && x < BX + BW && y >= Y && y < Y + P * rows().length && (y - Y) % P < 14 ? (y - Y) / P | 0 : -1
  const onTab = (x: number, y: number) => x >= TX && x < TX + TS && y >= TY && y < TY + TS
  const can = (i: number) => save.blood >= cost(rows()[i], save.lv[rows()[i]])
  return {
    flip() {
      open = !open
    },
    hover(x: number, y: number) {
      if (stuck && Math.hypot(x - stuck[0], y - stuck[1]) > 2) stuck = null
      hot = stuck ? -1 : row(x, y)
      tab = onTab(x, y)
      return tab || hot >= 0 && x >= BX && can(hot)
    },
    click(x: number, y: number) {
      const i = row(x, y), n = rows().length
      if (onTab(x, y)) open = !open
      else if (i >= 0 && x >= BX && !stuck) {
        buy(rows()[i])
        if (rows().length < n) stuck = [x, y]
      }
      return i >= 0 || onTab(x, y)
    },
    draw(g: Ctx) {
      box(g, TX, TY, TS, TS, tab ? UI.accent : UI.border, UI.panel)
      icon(g, open ? 'down' : 'right', TX + (open ? 5 : 6), TY + (open ? 6 : 5), UI.text)
      if (!open) return
      rows().forEach((s, i) => {
        const y = Y + i * P, ok = can(i)
        text(g, STATS[s].name, X + 2, y + 11, UI.text, undefined, UI.panel)
        text(g, String(save.lv[s]), BX - 5, y + 11, UI.accent, 'r', UI.panel)
        box(g, BX, y, BW, 14, !ok ? UI.dim : i === hot ? UI.text : UI.accent, UI.panel)
        drop(g, BX + 7, y + 7, ok ? C.red : UI.dim)
        text(g, String(cost(s, save.lv[s])), BX + BW - 4, y + 11, ok ? UI.text : UI.dim, 'r')
      })
      if (rows()[hot]) note(g, [STATS[rows()[hot]].tip, gain(rows()[hot])], BX + BW + 5, Y + hot * P - 1)
    },
  }
}
