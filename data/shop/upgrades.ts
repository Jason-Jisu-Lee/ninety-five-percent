import type { Stat } from '../dragonfly/stats'

const SMALL = [10, 16, 26, 42, 67], BIG = [120, 300]

export const UPGRADES: Record<string, [stat: Stat, each: number, cost: number[]]> = {
  'Sharp Mandibles': ['power', .25, SMALL],
  'Sharper Mandibles': ['power', .5, BIG],
  'Hard Shell': ['health', .25, SMALL],
  'Harder Shell': ['health', .5, BIG],
  'Thick Hide': ['armour', 2, [40, 80, 160]],
  'Long Wings': ['speed', .1, SMALL],
  'Longer Wings': ['speed', .2, BIG],
  'Split Wingbeat': ['turn', 1 / 3, [25, 50, 100]],
  'Counterweight Tail': ['accel', .25, SMALL],
  'Wide Spiracles': ['stamina', .25, SMALL],
  'Wider Spiracles': ['stamina', .5, BIG],
  'Warm Blood': ['rest', .1, [60]],
  'Slow Mend': ['mend', 1, [150]],
  'Dive Strike': ['dive', 1, [200]],
  'Ambush': ['ambush', 1, [200]],
}
