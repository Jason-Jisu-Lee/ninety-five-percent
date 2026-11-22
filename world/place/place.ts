import type { Place } from './kit'
import { marsh } from './marsh'
import { pond } from './pond'

const BUILD = [pond, marsh], made: Place[] = []

export const PLACES = ['Pond', 'Marsh']
export const where = { stage: 1 }
export const place = () => made[where.stage] ??= BUILD[where.stage - 1]()
