export const BASE = { speed: 1, power: 1, turn: 1, accel: 1, health: 1, stamina: 1, armour: 0, bite: 1, reach: 1, rest: 1, mend: 0, dive: 0, ambush: 0 }
export const STAT = { ...BASE }

export type Stat = keyof typeof BASE
