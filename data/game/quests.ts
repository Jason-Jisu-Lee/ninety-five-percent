import type { Kind } from '../enemies/enemies'

export const REVEAL = 2
export const QUESTS: { kind: Kind | 'look' | 'self' | 'feast' | 'lunge' | 'anatomy' | `buy ${Kind}`; n: number; blood: number; text: string; hint?: string }[] = [
  { kind: 'fruitfly', n: 3, blood: 5, text: 'Kill 3 fruit flies' },
  { kind: 'look', n: 1, blood: 5, text: 'View fruit fly details by clicking it' },
  { kind: 'self', n: 1, blood: 8, text: 'View dragonfly details' },
  { kind: 'feast', n: 1, blood: 10, text: 'Visit the Lair', hint: '(Hold the Lair button)' },
  { kind: 'lunge', n: 3, blood: 10, text: 'Catch a prey using Lunge' },
  { kind: 'buy moth', n: 1, blood: 15, text: 'Buy a Moth' },
  { kind: 'moth', n: 3, blood: 20, text: 'Kill 3 moths' },
  { kind: 'buy mayfly', n: 1, blood: 50, text: 'Buy Mayfly' },
  { kind: 'anatomy', n: 5, blood: 75, text: 'Purchase at least 5 more anatomy upgrades at the Lair' },
]
