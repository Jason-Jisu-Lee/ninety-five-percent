import { num } from '../../core/math/num'
import { CM } from '../../data/dragonfly/flight'
import { PREY, type Kind } from '../../data/enemies/enemies'
import type { Prey } from '../../world/creatures/prey'
import { card } from '../parts/card'
import type { Details } from '../parts/details'
import { tone } from './tone'
import { traits } from './traits'

export function foe(kind: Kind, hp = PREY[kind].hp): Details {
  const k = PREY[kind], whole = Math.round
  return {
    name: k.name, col: tone(kind), about: k.text, skills: traits(k),
    rows: [
      ['Damage', k.power ? num(k.power / k.strike) + '/s' : '0', 'Damage per second while held'],
      ['Health', hp < k.hp ? `${Math.ceil(hp)} / ${whole(k.hp)}` : String(whole(k.hp)), 'Hit points'],
      ['Speed', num(k.speed / CM) + ' cm/s', 'Flying speed'],
      ['Lifeblood', String(whole(k.blood)), 'Lifeblood paid for a kill'],
    ],
  }
}

export const enemyCard = () => card((p: Prey) => foe(p.kind, p.hp))
