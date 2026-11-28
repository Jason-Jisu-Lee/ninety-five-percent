export const BASE = { speed: 1, power: 1, turn: 1, health: 1, stamina: 1, armor: 0, bite: 1, reach: 1, rest: 1, mend: 0, dive: 0, ambush: 0, lunge: 0, auto: 0, streak: 0, gold: 0, rich: 2, lash: 0, prowl: 0 }
export const STAT = { ...BASE }

export type Stat = keyof typeof BASE

export const SHARE: Stat[] = ['power', 'health', 'speed', 'stamina', 'rest']
export const QUIET: Stat[] = ['armor', 'mend']
