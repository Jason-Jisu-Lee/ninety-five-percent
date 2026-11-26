import { num } from '../../core/math/num'
import type { Enemy } from '../../data/enemies/enemies'

export const traits = (k: Enemy) => ([
  [k.power, 'Fights back', `${num(k.power)} damage every ${Math.max(1, Math.round(k.strike))} s while held`],
  [k.grip, 'Breaks free', 'Escapes a hold after a moment and keeps its wounds'],
] as const).filter(t => t[0]).map(([, name, text]) => [name, text] as [string, string])
