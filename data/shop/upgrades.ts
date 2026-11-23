import type { Stat } from '../dragonfly/stats'

const SMALL = [10, 16, 26, 42, 67], BIG = [120, 300], FAST = (first: number, n: number, by: number) => Array.from({ length: n }, (_, i) => first * by ** i)

export const UPGRADES: Record<string, [stat: Stat, each: number, cost: number[]]> = {
  'Sharp Mandibles': ['power', .25, [5, ...SMALL.slice(1)]],
  'Sharper Mandibles': ['power', .5, BIG],
  'Hard Shell': ['health', .25, SMALL],
  'Harder Shell': ['health', .5, BIG],
  'Thick Hide': ['armour', 2, [40, 80, 160]],
  'Long Wings': ['speed', .1, SMALL],
  'Longer Wings': ['speed', .2, BIG],
  'Split Wingbeat': ['turn', 1 / 3, [25, 50, 100]],
  'Wide Spiracles': ['stamina', .25, SMALL],
  'Wider Spiracles': ['stamina', .5, BIG],
  'Warm Blood': ['rest', .1, [60]],
  'Slow Mend': ['mend', 1, [150]],
  'Lunge': ['lunge', 1, [25]],
  'Ambush': ['ambush', 1, [200]],
  'Dive Strike': ['dive', 1, [180000]],
  'Killing Streak': ['streak', 1, FAST(500, 4, 5)],
  'Golden Luck': ['gold', .02, FAST(300, 4, 5)],
  'Golden Blood': ['rich', .2, FAST(200, 10, 2)],
}
