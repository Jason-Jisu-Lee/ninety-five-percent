import { level, save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { COLORS } from '../../data/dragonfly/colors'
import { STAT } from '../../data/dragonfly/stats'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { OPEN } from '../../data/shop/open'
import { SHOP } from '../../data/shop/shop'
import { details, DW } from '../parts/details'
import { icon } from '../parts/icons'
import { box } from '../parts/panel'
import { ROWS } from '../shop/stats'

const X = W - DW >> 1, ITEMS = SHOP.flatMap(c => c.items)
const say = (name: string) => ITEMS.find(i => i.name === name)!.text.replace(/^passive\. /, '').split('. ').filter(s => !/^\d+ levels?$/.test(s)).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('. ')

export function flyCard() {
  let shown = false, hot = false, top = 0, tall = 0, mx = -1, my = -1
  const onX = (x: number, y: number) => x >= X + DW - 19 && x < X + DW - 8 && y >= top + 6 && y < top + 17
  return {
    shown: () => shown,
    open() {
      shown = true
    },
    hover: (x: number, y: number) => ([mx, my] = [x, y], hot = onX(x, y)),
    click(x: number, y: number) {
      if (onX(x, y) || x < X || x >= X + DW || y < top || y >= top + tall) shown = false
    },
    key(k: string) {
      if (k === 'Escape' || k === 'Enter' || k === ' ') shown = false
      return true
    },
    draw(g: Ctx) {
      if (!shown) return
      ;[, top, tall] = details(g, {
        name: 'Dragonfly', col: COLORS[save.color][0], about: 'Agile predatory insect',
        rows: ROWS.map(([n, s, , now, hint]) => [n, now(STAT[s], STAT.speed), hint]),
        skills: OPEN.Instinct.filter(n => level(n)).map(n => [n, say(n)]),
      }, t => [X, H - t >> 1], mx, my)
      box(g, X + DW - 19, top + 6, 11, 11, hot ? UI.accent : UI.border, UI.panel)
      icon(g, 'x', X + DW - 16, top + 9, UI.text)
    },
  }
}
