import { reach } from '../../core/save/wild'
import type { Place } from './kit'
import { marsh } from './marsh'
import { pond } from './pond'

const BUILD = [pond, marsh], SEED = [12, 5], made: Place[] = []

export const where = { stage: reach() }
export const scene = (stage: number) => made[stage] ??= BUILD[stage - 1](SEED[stage - 1])
export const place = () => scene(where.stage)
export const settle = () => where.stage = reach()
