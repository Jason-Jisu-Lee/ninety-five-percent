export const BASE = { speed: 1, power: 1, turn: 1, health: 2, stamina: 1, armour: 0, bite: 1, reach: 1, rest: 1, mend: 0, dive: 0, ambush: 0, lunge: 0, streak: 0, gold: 0, rich: 2 }
export const STAT = { ...BASE }

export type Stat = keyof typeof BASE

export const SHARE: Stat[] = ['power', 'health', 'speed', 'stamina', 'rest']
