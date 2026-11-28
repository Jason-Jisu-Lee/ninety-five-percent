import { level, save } from '../../core/save/save'
import { QUESTS } from '../../data/game/quests'
import { AFTER, BEFORE, FIRST, FREE, GROWN, HIDDEN, LATER, NEEDS, ONLY, OPEN, RIPE } from '../../data/shop/open'
import { SHOP } from '../../data/shop/shop'

const SHOPS = ['Blood shop', 'Evolution shop'].map(n => SHOP.filter(t => t.shop === n))
const gate = (tab: string, name: string) => AFTER[name] ?? (BEFORE[tab]?.includes(name) === false ? GROWN : '')
const before = (kind = '') => save.quest <= QUESTS.findIndex(q => q.kind === kind)

export const early = (side: number) => !side && !save.fed
export const veiled = (side: number, name: string) => HIDDEN.includes(name) || early(side) && !FIRST[name] || !side && before(AFTER[name])
export const listed = (side: number, peek: boolean) => [...SHOPS[side].filter(t => !veiled(side, t.name)), ...SHOPS[side].filter(t => peek && veiled(side, t.name))]
export const seen = (side: number, tab: string, tier: number, name = '') => !veiled(side, tab) && tier < FREE && !LATER.includes(name) && (!ONLY[tab] || ONLY[tab].includes(name)) && (!early(side) || !!FIRST[tab]?.includes(name)) && (!NEEDS[name] || level(NEEDS[name]) >= RIPE) && !before(gate(tab, name))
export const sold = (tab: string, name = '') => !OPEN[tab] || OPEN[tab].includes(name)
