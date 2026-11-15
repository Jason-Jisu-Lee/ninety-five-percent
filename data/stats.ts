export const STATS = {
  speed: { name: 'Speed', cost: 20, step: .12, tip: 'Flies faster.', unit: 'top speed' },
  power: { name: 'Power', cost: 30, step: 1, tip: 'Each bite does more damage.', unit: 'damage per bite' },
  agility: { name: 'Agility', cost: 20, step: .15, tip: 'Turns and accelerates faster.', unit: 'turning and acceleration' },
  health: { name: 'Health', cost: 20, step: 10, tip: 'Survives more damage.', unit: 'health' },
  stamina: { name: 'Stamina', cost: 20, step: .25, tip: 'Flies longer before it must rest.', unit: 'flight time' },
}

export type Stat = keyof typeof STATS

export const NAMES = Object.keys(STATS) as Stat[]
export const GROWTH = 1.5
export const cost = (s: Stat, lv: number) => Math.round(STATS[s].cost * GROWTH ** (lv - 1))
export const boost = (s: Stat, lv: number) => 1 + STATS[s].step * (lv - 1)
export const gain = (s: Stat) => `+${STATS[s].step < 1 ? Math.round(STATS[s].step * 100) + '%' : STATS[s].step} ${STATS[s].unit}`
export const stage = (lv: number) => Math.min(3, lv / 5 | 0)
