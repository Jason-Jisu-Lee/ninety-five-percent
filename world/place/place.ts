import type { Place } from './kit'
import { marsh } from './marsh'
import { pond } from './pond'

const BUILD = [pond, marsh], FIRST = [12, 5], made: Place[] = []
let seed = 0

export const PLACES = ['Pond', 'Marsh']
export const where = { stage: 1 }
export const place = () => made[where.stage] ??= BUILD[where.stage - 1](seed || FIRST[where.stage - 1])

export function renew() {
  seed = 1 + Math.random() * 99998 | 0
  made.length = 0
  place()
}
