import type { Kind } from '../enemies/enemies'

export const REVEAL = 2
export const QUESTS: { kind: Kind | 'look' | 'self' | 'feast'; n: number; blood: number; text: string }[] = [
  { kind: 'fruitfly', n: 5, blood: 5, text: 'Kill 5 fruit flies' },
  { kind: 'look', n: 1, blood: 5, text: 'View fruit fly details by clicking it' },
  { kind: 'self', n: 1, blood: 8, text: 'View dragonfly details by clicking it' },
  { kind: 'feast', n: 1, blood: 10, text: 'Visit the Lair by Feasting' },
]
