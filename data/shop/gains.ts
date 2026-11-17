import { BASE, type Stat } from '../dragonfly/stats'
import { SHOP } from './shop'

const STATS = Object.keys(BASE) as Stat[]
const RULES: [RegExp, Stat[]][] = [
  [/^\+(\d+)(%?) base power/, ['power']],
  [/^\+(\d+)(%?) base health/, ['health']],
  [/^\+(\d+)(%?) base speed/, ['speed']],
  [/^\+(\d+)(%?) base turning/, ['turn']],
  [/^\+(\d+)(%?) base acceleration/, ['accel']],
  [/^\+(\d+)(%?) base stamina/, ['stamina']],
  [/^\+(\d+)(%) to every base stat/, ['speed', 'power', 'turn', 'accel', 'health', 'stamina']],
  [/does (\d+)() less damage/, ['armour']],
  [/bites land (\d+)(%) faster/, ['bite']],
  [/catches prey from (\d+)(%) farther/, ['reach']],
  [/restores stamina and health (\d+)(%) faster/, ['rest']],
]

export function gain(text: string) {
  for (const [rule, stats] of RULES) {
    const m = text.match(rule)
    if (m) return { stats, n: +m[1], pct: !!m[2] }
  }
  return null
}

export function tally(owned: string[]) {
  const add = { ...BASE }, mul = { ...BASE }
  for (const s of STATS) mul[s] = 1
  for (const it of SHOP.flatMap(c => c.items)) {
    const hit = owned.includes(it.name) && gain(it.text)
    if (hit) for (const s of hit.stats) (hit.pct ? mul : add)[s] += hit.n / (hit.pct ? 100 : 1)
  }
  for (const s of STATS) add[s] *= mul[s]
  return add
}
