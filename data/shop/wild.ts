import { cast, PREY, type Kind } from '../enemies/enemies'
import { ENTRY, PLACES } from '../game/map'

export type Wild = { name: string; text: string; off: boolean; cost: number; stage: number; row: number; kind?: Kind }

export const WILD = PLACES.flatMap((place, i) => [
  ...(i ? [{ name: place, cost: ENTRY[i] } as Pick<Wild, 'name' | 'cost' | 'kind'>] : []),
  ...cast(i + 1).filter(k => PREY[k].unlock).sort((a, b) => PREY[a].unlock - PREY[b].unlock).map(kind => ({ name: PREY[kind].name, cost: PREY[kind].unlock, kind })),
].map((w, row): Wild => ({ text: '', off: false, stage: i + 1, row, ...w })))
