import type { Kind } from '../enemies/enemies'

export const REVEAL = 2
export const QUESTS: { kind: Kind | 'look' | 'self' | 'feast' | 'lunge' | 'anatomy' | 'mutate' | 'pick' | 'marsh' | `buy ${Kind}`; n: number; blood: number; text: string; hint?: string; gives?: string }[] = [
  { kind: 'fruitfly', n: 3, blood: 5, text: 'Kill 3 fruit flies' },
  { kind: 'look', n: 1, blood: 5, text: 'View fruit fly details by clicking it' },
  { kind: 'self', n: 1, blood: 8, text: 'View dragonfly details' },
  { kind: 'feast', n: 1, blood: 10, text: 'Visit the Lair', hint: '(Hold the Lair button)' },
  { kind: 'lunge', n: 3, blood: 10, text: 'Catch a prey using Lunge' },
  { kind: 'buy moth', n: 1, blood: 15, text: 'Buy a Moth' },
  { kind: 'moth', n: 3, blood: 20, text: 'Kill 3 moths' },
  { kind: 'buy mayfly', n: 1, blood: 50, text: 'Buy Mayfly' },
  { kind: 'anatomy', n: 4, blood: 0, gives: 'Lair expanded', text: 'Purchase at least 4 more anatomy upgrades at the Lair' },
  { kind: 'ladybird', n: 3, blood: 25, text: 'Kill 3 ladybirds' },
  { kind: 'mutate', n: 1, blood: 30, text: 'Buy Mutations' },
  { kind: 'pick', n: 1, blood: 30, text: 'Pick a mutation' },
  { kind: 'bumblebee', n: 1, blood: 40, text: 'Kill a bumblebee' },
  { kind: 'wasp', n: 1, blood: 60, text: 'Kill a wasp' },
  { kind: 'marsh', n: 1, blood: 100, text: 'Reach the Marsh' },
]
