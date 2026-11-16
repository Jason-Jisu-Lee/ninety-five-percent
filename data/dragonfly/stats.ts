export const STATS = {
  speed: { name: 'Speed', cost: 20, step: .12, max: 0, tip: 'Flies faster.', unit: 'top speed' },
  power: { name: 'Power', cost: 30, step: .2, max: 0, tip: 'Each bite does more damage.', unit: 'damage per bite' },
  agility: { name: 'Agility', cost: 20, step: .1, max: 11, tip: 'Turns and accelerates faster.', unit: 'turning and acceleration' },
  health: { name: 'Health', cost: 20, step: .2, max: 0, tip: 'Survives more damage.', unit: 'health' },
  stamina: { name: 'Stamina', cost: 20, step: .05, max: 0, tip: 'Flies longer before it must rest.', unit: 'flight time' },
}

export type Stat = keyof typeof STATS

export const NAMES = Object.keys(STATS) as Stat[]
const BASE: Record<Stat, number> = { speed: 1, power: 1, agility: 1, health: 1, stamina: 1 }
const GROWTH = 1.5
export const cost = (s: Stat, lv: number) => Math.round(STATS[s].cost * GROWTH ** (lv - 1))
export const boost = (s: Stat, lv: number) => BASE[s] * (1 + STATS[s].step * (lv - 1))
export const gain = (s: Stat) => `+${Math.round(STATS[s].step * 100)}% ${STATS[s].unit}`
export const full = (s: Stat, lv: number) => STATS[s].max > 0 && lv >= STATS[s].max
export const stage = (lv: number) => Math.min(3, lv / 5 | 0)
