import { cast, PREY, type Kind } from '../enemies/enemies'
import { ENTRY, PLACES } from '../game/map'

export type Wild = { name: string; cost: number; stage: number; kind?: Kind }

export const WILD: Wild[] = PLACES.flatMap((place, i) => [
  ...(i ? [{ name: place, cost: ENTRY[i] } as Omit<Wild, 'stage'>] : []),
  ...cast(i + 1).filter(k => PREY[k].unlock).sort((a, b) => PREY[a].unlock - PREY[b].unlock).map(kind => ({ name: PREY[kind].name, cost: PREY[kind].unlock, kind })),
].map(w => ({ stage: i + 1, ...w })))
