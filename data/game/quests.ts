import type { Kind } from '../enemies/enemies'

export const QUESTS: { kind: Kind | 'look'; n: number; blood: number; text: string }[] = [
  { kind: 'fruitfly', n: 3, blood: 5, text: 'Catch 3 fruit flies' },
  { kind: 'look', n: 1, blood: 5, text: 'View prey details (click prey) while resting' },
]
