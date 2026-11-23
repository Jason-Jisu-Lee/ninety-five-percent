import type { Kind } from '../enemies/enemies'

export const QUESTS: { kind: Kind | 'look'; n: number; blood: number; text: string }[] = [
  { kind: 'fruitfly', n: 5, blood: 5, text: 'Kill 5 fruit flies' },
  { kind: 'look', n: 1, blood: 5, text: 'View prey details (click prey) while resting' },
]
