import type { Kind } from '../enemies/enemies'

export const REVEAL = 2
export const QUESTS: { kind: Kind | 'look' | 'self' | 'feast' | 'lunge'; n: number; blood: number; text: string }[] = [
  { kind: 'fruitfly', n: 3, blood: 5, text: 'Kill 3 fruit flies' },
  { kind: 'look', n: 1, blood: 5, text: 'View fruit fly details by clicking it' },
  { kind: 'self', n: 1, blood: 8, text: 'View dragonfly details' },
  { kind: 'feast', n: 1, blood: 10, text: 'Visit the Lair' },
  { kind: 'lunge', n: 3, blood: 10, text: 'Catch a prey using Lunge' },
]
