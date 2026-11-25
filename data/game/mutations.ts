import type { Kind } from '../enemies/enemies'
import type { Stat } from '../dragonfly/stats'

export type Mutation = { name: string; text: string; stat: Stat; add: number; needs?: string }

export const MUTATE = { name: 'Mutations', say: 'Something is changing...', cost: 200, after: 'mayfly' as Kind, picks: 3, need: (n: number) => 50 + 5 * n * (n + 5) }
export const MUTATIONS: Mutation[] = [
  { name: 'Second Jaw', text: '+0.5 damage', stat: 'power', add: .5 },
  { name: 'Second Heart', text: '+1 health', stat: 'health', add: 1 },
  { name: 'Extra Lungs', text: '+5 s stamina', stat: 'stamina', add: .2 },
  { name: 'Twin Tail', text: '+15 deg/s turning', stat: 'turn', add: .2 },
  { name: 'Spring Jaw', text: '+2 damage on a Lunge bite', stat: 'lash', add: 2, needs: 'Lunge' },
  { name: 'Silent Wings', text: '+2 damage on an Ambush bite', stat: 'prowl', add: 2, needs: 'Ambush' },
]
