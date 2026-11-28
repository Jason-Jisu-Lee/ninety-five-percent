import { level, save } from '../../core/save/save'
import { COLORS } from '../../data/dragonfly/colors'
import { STAT } from '../../data/dragonfly/stats'
import { OPEN } from '../../data/shop/open'
import { SHOP } from '../../data/shop/shop'
import { card } from '../parts/card'
import type { Details } from '../parts/details'
import { MANUAL } from '../shop/about'
import { ROWS, shown } from '../shop/stats'

const ITEMS = SHOP.flatMap(c => c.items)
const say = (name: string) => ITEMS.find(i => i.name === name)!.text.replace(MANUAL, '').split('. ').filter(s => !/^\d+ levels?$/.test(s)).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('. ')
const me = (): Details => ({
  name: 'Dragonfly', col: COLORS[save.color][0], about: 'Agile predatory insect',
  rows: ROWS.map(([n, s, , , hint], i) => [n, shown(i, STAT[s], STAT.speed), hint]),
  skills: OPEN.Instinct.filter(n => level(n)).map(n => [n, say(n)]),
})

export function flyCard() {
  const c = card(me)
  return { ...c, open: () => c.open(true) }
}
