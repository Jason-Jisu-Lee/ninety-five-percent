import { CM } from '../../data/dragonfly/flight'
import type { Enemy } from '../../data/enemies/enemies'

export const traits = (k: Enemy) => ([
  [k.power, 'Fights back', `${+k.power.toFixed(2)} damage every ${Math.max(1, Math.round(k.strike))} s while held`],
  [k.grip, 'Breaks free', 'Escapes a hold after a moment and keeps its wounds'],
  [k.dodge, 'Sidestep', 'Darts sideways when approached'],
  [k.fast && !k.dodge, 'Burst', `Flees at ${+(k.fast / CM).toFixed(2)} cm/s for a moment`],
  [k.cover, 'Hides', 'Slips into the grass when chased'],
  [k.land, 'Sits', 'Lands to rest and is slower to notice danger'],
  [k.stay, 'Visitor', 'Crosses the stage, then leaves'],
] as const).filter(t => t[0]).map(([, name, text]) => [name, text] as [string, string])
