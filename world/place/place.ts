import { reach } from '../../core/save/wild'
import { NESTS } from '../../data/game/map'
import type { Place } from './kit'
import { marsh } from './marsh'
import { pond } from './pond'

const BUILD = [pond, marsh], SEED = [12, 5], made: Place[] = []
let turn = 0

export const where = { stage: reach() }
const scene = (stage: number) => made[stage] ??= BUILD[stage - 1](SEED[stage - 1])
export const place = () => scene(where.stage)
export const settle = () => where.stage = reach()
export function rotate() {
  const pool = NESTS[where.stage]
  if (pool) place().swarms.splice(0, Infinity, ...pool[++turn % pool.length])
}
