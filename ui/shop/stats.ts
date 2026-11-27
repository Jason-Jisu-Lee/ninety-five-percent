import { num } from '../../core/math/num'
import { gain, level } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { CM, FLY, STAMINA } from '../../data/dragonfly/flight'
import { BASE, STAT, type Stat } from '../../data/dragonfly/stats'
import { UI } from '../../data/look/palette'
import { UPGRADES } from '../../data/shop/upgrades'
import { note } from '../parts/note'
import { text } from '../text/text'

const WIDE = 176, MID = 116
export const ROWS: [label: string, stat: Stat, base: (v: number) => string, now: (v: number, speed: number) => string, hint: string][] = [
  ['Damage', 'power', num, num, 'Damage per attack'],
  ['Health', 'health', num, num, 'Hit points'],
  ['Armor', 'armor', num, num, 'Damage blocked per attack'],
  ['Speed', 'speed', v => num(FLY.top * v / CM), v => num(FLY.top * v / CM) + ' cm/s', 'Flying speed'],
  ['Turning', 'turn', v => num(75 * v), (v, speed) => num(Math.min(75 * v * speed ** 2, FLY.top * speed / FLY.pivot * 180 / Math.PI)) + ' deg/s', 'How fast it turns'],
  ['Stamina', 'stamina', v => num(100 / STAMINA.drain * v), v => num(100 / STAMINA.drain * v) + ' s', 'How long it can fly'],
  ['Rest', 'rest', v => num(STAMINA.regen * v) + '%', v => num(STAMINA.regen * v) + '%/s', 'Stamina regained per second of rest'],
  ['Mend in flight', 'mend', v => num(v) + '%', v => num(v) + '%/s', 'Health regained per second of flight'],
]

export function stats(x: number, y: number, bare = false) {
  let over = -1
  return {
    hover(mx: number, my: number) {
      const i = mx >= x && mx < x + WIDE ? Math.floor((my - y - 4) / 10) : -1
      over = ROWS[i]?.[4] ? i : -1
    },
    draw(g: Ctx, hot = '') {
      const [stat, , cost] = UPGRADES[hot] ?? [], next = level(hot) < (cost?.length ?? 0)
      if (!bare) text(g, 'Base', x + MID, y, UI.dim, 'r')
      if (!bare) text(g, 'Now', x + WIDE, y, UI.dim, 'r')
      const speed = STAT.speed + (stat === 'speed' && next ? gain(hot) : 0)
      ROWS.forEach(([label, s, base, now], i) => {
        const ry = y + 12 + i * 10, on = s === stat || s === 'turn' && stat === 'speed'
        text(g, label, x, ry, on ? UI.gold : i === over ? UI.accent : UI.text)
        if (!bare) text(g, base(BASE[s]), x + MID, ry, UI.dim, 'r')
        text(g, now(STAT[s] + (s === stat && next ? gain(hot) : 0), speed), x + WIDE, ry, on && next ? UI.gold : UI.text, 'r')
      })
    },
    tip(g: Ctx) {
      if (over >= 0) note(g, [ROWS[over][4]], x - 8, y + over * 10 + 1, true)
    },
  }
}
