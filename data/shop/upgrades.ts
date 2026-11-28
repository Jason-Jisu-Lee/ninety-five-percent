import type { Stat } from '../dragonfly/stats'
import { SHOP } from './shop'

const GIVES: Record<string, [stat: Stat, each: number]> = {
  'Sharp Mandibles': ['power', .25],
  'Sharper Mandibles': ['power', .5],
  'Strong Heart': ['health', .25],
  'Stronger Heart': ['health', .5],
  'Hard Shell': ['armor', 1],
  'Long Wings': ['speed', .1],
  'Longer Wings': ['speed', .2],
  'Wide Spiracles': ['stamina', .12],
  'Wider Spiracles': ['stamina', .25],
  'Warm Blood': ['rest', .1],
  'Slow Mend': ['mend', 1],
  'Lunge': ['lunge', 1],
  'Ambush': ['ambush', 1],
  'Dive Strike': ['dive', 1],
  'Auto Target': ['auto', 1],
  'Auto Lunge': ['autolunge', 1],
  'Feeding Rest': ['fuel', 1],
  'Bounty': ['bounty', 1],
  'Bigger Bounty': ['bounty', 2],
  'Killing Streak': ['streak', 1],
  'Golden Luck': ['gold', .02],
  'Golden Blood': ['rich', .2],
}
const COST: Record<string, number[]> = Object.fromEntries(SHOP.flatMap(t => t.items).map(i => [i.name, i.cost]))

export const ALSO: Record<string, [stat: Stat, each: number]> = { 'Long Wings': ['turn', 20 / 75], 'Longer Wings': ['turn', 50 / 75] }
export const UPGRADES: Record<string, [stat: Stat, each: number, cost: number[]]> = Object.fromEntries(Object.entries(GIVES).map(([name, give]) => [name, [...give, COST[name] ?? []]]))
