import type { Kind } from '../enemies/enemies'

export const QUESTS: { kind: Kind; n: number; text: string }[] = [
  { kind: 'gnat', n: 10, text: 'Catch 10 gnats' },
  { kind: 'mosquito', n: 8, text: 'Catch 8 mosquitoes' },
  { kind: 'housefly', n: 3, text: 'Catch 3 houseflies' },
]
