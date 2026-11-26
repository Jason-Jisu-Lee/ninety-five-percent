import { num } from '../../core/math/num'
import { CM } from '../../data/dragonfly/flight'
import type { Enemy } from '../../data/enemies/enemies'

export const traits = (k: Enemy) => ([
  [k.power, 'Fights back', `${num(k.power)} damage every ${Math.max(1, Math.round(k.strike))} s while held`],
  [k.grip, 'Breaks free', 'Escapes a hold after a moment and keeps its wounds'],
  [k.dodge, 'Sidestep', 'Darts sideways when approached'],
  [k.fast && !k.dodge, 'Burst', `Flees at ${num(k.fast / CM)} cm/s for a moment`],
  [k.cover, 'Hides', 'Slips into the grass when chased'],
] as const).filter(t => t[0]).map(([, name, text]) => [name, text] as [string, string])
