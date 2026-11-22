import { reach } from '../../core/save/wild'
import type { Place } from './kit'
import { marsh } from './marsh'
import { pond } from './pond'

const BUILD = [pond, marsh], FIRST = [12, 5], made: Place[] = []
let seed = 0

export const where = { stage: reach() }
export const scene = (stage: number) => made[stage] ??= BUILD[stage - 1](seed || FIRST[stage - 1])
export const place = () => scene(where.stage)
export const settle = () => where.stage = reach()

export function renew() {
  seed = 1 + Math.random() * 99998 | 0
  made.length = 0
  place()
}
