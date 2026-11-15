import type { PREY } from './prey'

export const QUESTS: { kind: keyof typeof PREY; n: number; text: string }[] = [
  { kind: 'gnat', n: 10, text: 'Catch 10 gnats' },
  { kind: 'mosquito', n: 8, text: 'Catch 8 mosquitoes' },
  { kind: 'fly', n: 3, text: 'Catch 3 houseflies' },
]
