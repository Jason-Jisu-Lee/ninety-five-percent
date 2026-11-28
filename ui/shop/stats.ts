import { num, whole } from '../../core/math/num'
import { gain, level } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { FIGHT } from '../../data/dragonfly/fight'
import { CM, FLY, STAMINA } from '../../data/dragonfly/flight'
import { BASE, QUIET, STAT, type Stat } from '../../data/dragonfly/stats'
import { UI } from '../../data/look/palette'
import { ALSO, UPGRADES } from '../../data/shop/upgrades'
import { note } from '../parts/note'
import { text, width } from '../text/text'

const WIDE = 176, up = (v: number) => Math.ceil(v - 1e-9)
const ALL: [label: string, stat: Stat, value: (v: number, speed: number) => number, unit: string, hint: string][] = [
  ['Damage', 'power', v => v, '', 'Damage per attack'],
  ['Attack speed', 'bite', v => v / FIGHT.bite, '/s', 'Attacks per second'],
  ['Health', 'health', v => v, '', 'Hit points'],
  ['Armor', 'armor', v => v, '', 'Damage blocked per attack'],
  ['Speed', 'speed', v => whole(FLY.top * v / CM), ' cm/s', 'Flying speed'],
  ['Turning', 'turn', (v, speed) => Math.round(Math.min(75 * v, FLY.top * speed / FLY.pivot * 180 / Math.PI)), ' deg/s', 'How fast it turns'],
  ['Stamina', 'stamina', v => up(100 / STAMINA.drain * v), ' s', 'How long it can fly'],
  ['Rest', 'rest', v => up(STAMINA.regen * v), '%/s', 'Stamina regained per second of rest'],
  ['Mend', 'mend', v => v, '/s', 'Health regained per second of flight'],
]
export const ROWS = ALL.filter(r => !QUIET.includes(r[1]))
export const shown = (i: number, v: number, speed: number) => num(ROWS[i][2](v, speed)) + ROWS[i][3]

export function stats(x: number, y: number) {
  let over = -1, on = false
  const plain = (i: number) => shown(i, STAT[ROWS[i][1]], STAT.speed)
  return {
    hover(mx: number, my: number) {
      const i = mx >= x && mx < x + WIDE ? Math.floor((my - y - 4) / 10) : -1
      over = ROWS[i] ? i : -1
      on = over >= 0 && mx >= x + WIDE - width(plain(over)) - 2
    },
    draw(g: Ctx, hot = '') {
      const [stat, , cost] = UPGRADES[hot] ?? [], next = level(hot) < (cost?.length ?? 0), also = ALSO[hot]
      const add = (s: Stat) => next ? (s === stat ? gain(hot) : 0) + (also?.[0] === s ? also[1] : 0) : 0, speed = STAT.speed + add('speed')
      ROWS.forEach(([label, s, value, unit], i) => {
        const ry = y + 12 + i * 10, lit = s === stat || also?.[0] === s, base = value(BASE[s], BASE.speed), now = value(STAT[s] + add(s), speed)
        const split = on && i === over && !lit && now !== base ? `(${num(base)}+${num(now - base)})${unit}` : num(now) + unit
        text(g, label, x, ry, lit ? UI.gold : i === over && !on ? UI.accent : UI.text)
        text(g, split, x + WIDE, ry, lit && next ? UI.gold : i === over && on ? UI.accent : UI.text, 'r')
      })
    },
    tip(g: Ctx) {
      if (over >= 0 && !on) note(g, [ROWS[over][4]], x - 8, y + over * 10 + 1, true)
    },
  }
}
