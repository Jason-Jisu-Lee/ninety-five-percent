import { WING } from './dragonfly'
import { FOREST as C } from './palette'

const INK = WING.stigma

export const PREY = {
  gnat: { hp: 1, energy: 1, count: 12, back: 10, stay: 0, zone: 'swarm', h: 24, speed: 0, fast: 0, flee: 0, wind: 0, tire: 0, dodge: 0, turn: 0, jink: 0, sit: 0, land: 0, cover: 0, grip: 0, wary: 0, len: 1, wide: 1, wing: 1, chord: 1, beat: 9, body: INK, band: '', eye: INK, tint: WING.fill },
  mosquito: { hp: 2, energy: 3, count: 5, back: 5, stay: 0, zone: 'water', h: 16, speed: 24, fast: 44, flee: 28, wind: .6, tire: 1, dodge: 0, turn: 5, jink: 1.3, sit: 0, land: 0, cover: 0, grip: 0, wary: .2, len: 3, wide: 1, wing: 2, chord: 1, beat: 14, body: INK, band: '', eye: INK, tint: WING.fill },
  moth: { hp: 3, energy: 5, count: 3, back: 5, stay: 0, zone: 'flowers', h: 20, speed: 36, fast: 80, flee: 44, wind: .8, tire: 1.2, dodge: 0, turn: 7, jink: 1.6, sit: 3, land: 1, cover: 60, grip: 0, wary: .5, len: 4, wide: 2, wing: 4, chord: 4, beat: 7, body: C.t0, band: '', eye: C.t1, tint: C.white },
  fly: { hp: 4, energy: 8, count: 3, back: 5, stay: 0, zone: 'sites', h: 18, speed: 70, fast: 150, flee: 52, wind: .7, tire: 2, dodge: 0, turn: 9, jink: .7, sit: 2.5, land: 1, cover: 40, grip: 0, wary: 1.5, len: 4, wide: 2, wing: 3, chord: 2, beat: 14, body: INK, band: '', eye: C.pink, tint: WING.fill },
  hoverfly: { hp: 5, energy: 14, count: 2, back: 8, stay: 0, zone: 'flowers', h: 22, speed: 110, fast: 340, flee: 46, wind: .16, tire: .2, dodge: 54, turn: 16, jink: .1, sit: 3, land: 0, cover: 0, grip: 1.2, wary: 3, len: 4, wide: 2, wing: 3, chord: 1, beat: 18, body: INK, band: C.yellow, eye: C.t0, tint: WING.fill },
  horsefly: { hp: 24, energy: 80, count: 1, back: 60, stay: 35, zone: 'cross', h: 26, speed: 100, fast: 165, flee: 64, wind: 1.2, tire: 1.5, dodge: 150, turn: 5, jink: .3, sit: 0, land: 0, cover: 0, grip: 1.9, wary: 4, len: 8, wide: 4, wing: 7, chord: 3, beat: 14, body: C.r0, band: C.r1, eye: C.husk, tint: WING.fill },
}

export const BITE = { every: .35 }
export const FREE = 1.2
