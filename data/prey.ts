import { WING } from './dragonfly'
import { FOREST as C } from './palette'

const INK = WING.stigma

export const PREY = {
  gnat: { hp: 1, energy: 1, count: 12, h: 32, speed: 0, burst: 1, flee: 0, turn: 0, jink: 0, len: 1, wide: 1, wing: 1, chord: 1, beat: 9, body: INK, eye: INK, tint: WING.fill },
  mosquito: { hp: 2, energy: 3, count: 4, h: 22, speed: 40, burst: 1, flee: 0, turn: 9, jink: 1.2, len: 4, wide: 1, wing: 2, chord: 1, beat: 14, body: INK, eye: INK, tint: WING.fill },
  fly: { hp: 3, energy: 5, count: 3, h: 26, speed: 80, burst: 1.8, flee: 60, turn: 14, jink: 2.2, len: 5, wide: 3, wing: 3, chord: 2, beat: 14, body: INK, eye: C.pink, tint: WING.fill },
  moth: { hp: 4, energy: 8, count: 2, h: 30, speed: 50, burst: 1.5, flee: 50, turn: 16, jink: 3, len: 6, wide: 2, wing: 6, chord: 6, beat: 7, body: C.t0, eye: C.t1, tint: C.white },
}

export const BITE = { damage: 1, every: .35 }
export const RESPAWN = [2, 5]
export const POST = { r: 90 }
