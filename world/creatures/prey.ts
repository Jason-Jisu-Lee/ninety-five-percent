import { PREY, type Kind } from '../../data/enemies/enemies'
import { H, W } from '../../data/look/screen'
import { place } from '../place/place'

export type Prey = { kind: Kind; x: number; y: number; h: number; ang: number; hp: number; wings: boolean; gold: boolean; flash: number; seed: number; age: number; gx: number; gy: number; wait: number; fear: number; tired: number; free: number; vx: number; vy: number; stray?: boolean }

const R = Math.random

export function errand(p: Prey) {
  const k = PREY[p.kind], zone = p.stray ? 'cross' : k.zone, r = k.land ? 2 : zone === 'swarm' ? 0 : 13, { swarms, flowers, sites, rafts, wet } = place()
  if (zone === 'water' && !(k.land && rafts.length)) do [p.gx, p.gy] = [20 + R() * (W - 40), 30 + R() * (H - 50)]; while (!wet(p.gx, p.gy, 8))
  else if (zone === 'cross') [p.gx, p.gy] = [40 + R() * (W - 80), 50 + R() * (H - 80)]
  else {
    const list = zone === 'swarm' ? swarms : zone === 'flowers' ? flowers : zone === 'water' ? rafts : sites, [x, y] = list[R() * list.length | 0] ?? [W / 2, H / 2]
    p.gx = x + (R() - .5) * 2 * r
    p.gy = y + (R() - .5) * 2 * r
  }
}
