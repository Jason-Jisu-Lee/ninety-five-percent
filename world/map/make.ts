import { rng } from '../../core/math/rng'
import { grow } from './grow'
import { land } from './land'

export function make(seed: number) {
  const R = rng(seed), L = land(R)
  return { seed, ...L, things: grow(R, L) }
}

export type World = ReturnType<typeof make>
