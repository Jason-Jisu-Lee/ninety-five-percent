import { gain, level } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { CM, FLY, STAMINA } from '../../data/dragonfly/flight'
import { BASE, STAT, type Stat } from '../../data/dragonfly/stats'
import { UI } from '../../data/look/palette'
import { UPGRADES } from '../../data/shop/upgrades'
import { note } from '../parts/note'
import { text } from '../text/text'

const WIDE = 176, MID = 116, num = (v: number) => String(+v.toFixed(2))
const ROWS: [label: string, stat: Stat, base: (v: number) => string, now: (v: number) => string, hint: string][] = [
  ['Power', 'power', num, num, ''],
  ['Health', 'health', num, num, ''],
  ['Damage blocked', 'armour', num, num, 'Damage blocked per attack'],
  ['Speed', 'speed', v => num(FLY.top * v / CM), v => num(FLY.top * v / CM) + ' cm/s', ''],
  ['Turning', 'turn', v => num(75 * v), v => num(75 * v) + ' deg/s', 'How fast it turns'],
  ['Stamina', 'stamina', v => num(100 / STAMINA.drain * v), v => num(100 / STAMINA.drain * v) + ' s', 'Flying time before it must rest'],
  ['Rest', 'rest', v => num(STAMINA.regen * v) + '%', v => num(STAMINA.regen * v) + '%/s', 'Stamina regained per second of rest'],
  ['Mend in flight', 'mend', v => num(v) + '%', v => num(v) + '%/s', 'Health regained per second of flight'],
]

export const TALL = ROWS.length * 10 + 6

export function stats(x: number, y: number) {
  let over = -1
  return {
    hover(mx: number, my: number) {
      const i = mx >= x && mx < x + WIDE ? Math.floor((my - y - 4) / 10) : -1
      over = ROWS[i]?.[4] ? i : -1
    },
    draw(g: Ctx, hot = '') {
      const [stat, , cost] = UPGRADES[hot] ?? [], next = level(hot) < (cost?.length ?? 0)
      text(g, 'Base', x + MID, y, UI.dim, 'r')
      text(g, 'Now', x + WIDE, y, UI.dim, 'r')
      ROWS.forEach(([label, s, base, now], i) => {
        const ry = y + 12 + i * 10, on = s === stat
        text(g, label, x, ry, on ? UI.gold : i === over ? UI.accent : UI.text)
        text(g, base(BASE[s]), x + MID, ry, UI.dim, 'r')
        text(g, now(STAT[s] + (on && next ? gain(hot) : 0)), x + WIDE, ry, on && next ? UI.gold : UI.text, 'r')
      })
      if (over >= 0) note(g, [ROWS[over][4]], x - 8, y + over * 10 + 1, true)
    },
  }
}
