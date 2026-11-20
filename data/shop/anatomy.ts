import type { Stat } from '../dragonfly/stats'

const SMALL = [10, 16, 26, 42, 67], BIG = [120, 300]

export const ANATOMY: Record<string, [stat: Stat, each: number, cost: number[]]> = {
  'Sharp Mandibles': ['power', .2, SMALL],
  'Sharper Mandibles': ['power', .6, BIG],
  'Hard Shell': ['health', .2, SMALL],
  'Harder Shell': ['health', .6, BIG],
  'Thick Hide': ['armour', .2, [40, 80, 160]],
  'Long Wings': ['speed', .1, SMALL],
  'Longer Wings': ['speed', .25, BIG],
  'Split Wingbeat': ['turn', 1 / 3, [25, 50, 100]],
  'Counterweight Tail': ['accel', .25, SMALL],
  'Wide Spiracles': ['stamina', .2, SMALL],
  'Wider Spiracles': ['stamina', .6, BIG],
  'Warm Blood': ['rest', .25, [60]],
  'Slow Mend': ['mend', .5, [150]],
}
