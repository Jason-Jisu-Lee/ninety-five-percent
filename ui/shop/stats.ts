import { level } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { FLY, STAMINA } from '../../data/dragonfly/flight'
import { BASE, STAT, type Stat } from '../../data/dragonfly/stats'
import { UI } from '../../data/look/palette'
import { UPGRADES } from '../../data/shop/upgrades'
import { text } from '../text/text'

const X = 432, R = 608, MID = 548, num = (v: number) => String(+v.toFixed(2))
const ROWS: [label: string, stat: Stat, base: (v: number) => string, now: (v: number) => string][] = [
  ['Power', 'power', num, num],
  ['Health', 'health', num, num],
  ['Damage blocked', 'armour', num, num],
  ['Top speed', 'speed', v => num(FLY.top * v / 3.8), v => num(FLY.top * v / 3.8) + ' cm/s'],
  ['Turning', 'turn', v => num(75 * v), v => num(75 * v) + ' deg/s'],
  ['Acceleration', 'accel', v => num(Math.log(10) / (FLY.accel * v)), v => num(Math.log(10) / (FLY.accel * v)) + ' s'],
  ['Stamina', 'stamina', v => num(100 / STAMINA.drain * v), v => num(100 / STAMINA.drain * v) + ' s'],
  ['Catch reach', 'reach', v => num(FLY.catch * v), v => num(FLY.catch * v)],
  ['Rest', 'rest', v => num(STAMINA.regen * v) + '%', v => num(STAMINA.regen * v) + '%/s'],
  ['Mend in flight', 'mend', v => num(v) + '%', v => num(v) + '%/s'],
]

export function stats(g: Ctx, hot = '') {
  const [stat, each, cost] = UPGRADES[hot] ?? [], next = level(hot) < (cost?.length ?? 0)
  text(g, 'Base', MID, 110, UI.dim, 'r')
  text(g, 'Now', R, 110, UI.dim, 'r')
  ROWS.forEach(([label, s, base, now], i) => {
    const y = 122 + i * 10, on = s === stat
    text(g, label, X, y, on ? UI.gold : UI.text)
    text(g, base(BASE[s]), MID, y, UI.dim, 'r')
    text(g, now(STAT[s] + (on && next ? each! : 0)), R, y, on && next ? UI.gold : UI.text, 'r')
  })
}
