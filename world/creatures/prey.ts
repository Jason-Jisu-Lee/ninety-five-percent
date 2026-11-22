import { PREY, type Kind } from '../../data/enemies/enemies'
import { H, W } from '../../data/look/screen'
import { place } from '../place/place'

export type Prey = { kind: Kind; x: number; y: number; h: number; ang: number; hp: number; wings: boolean; gold: boolean; flash: number; seed: number; age: number; gx: number; gy: number; wait: number; fear: number; tired: number; free: number; vx: number; vy: number }

const R = Math.random

export function errand(p: Prey) {
  const k = PREY[p.kind], r = k.land ? 2 : k.zone === 'swarm' ? 0 : 13, { swarms, flowers, sites, rafts, wet } = place()
  if (k.zone === 'water' && !(k.land && rafts.length)) do [p.gx, p.gy] = [20 + R() * (W - 40), 30 + R() * (H - 50)]; while (!wet(p.gx, p.gy, 8))
  else if (k.zone === 'cross') [p.gx, p.gy] = [40 + R() * (W - 80), 50 + R() * (H - 80)]
  else {
    const list = k.zone === 'swarm' ? swarms : k.zone === 'flowers' ? flowers : k.zone === 'water' ? rafts : sites, [x, y] = list[R() * list.length | 0] ?? [W / 2, H / 2]
    p.gx = x + (R() - .5) * 2 * r
    p.gy = y + (R() - .5) * 2 * r
  }
}
