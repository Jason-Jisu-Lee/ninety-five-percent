import { PREY, type Kind } from '../../data/enemies/enemies'
import { H, W } from '../../data/look/screen'
import { FLOWERS, SITES, SWARMS } from '../../data/stage1/map'
import { depth } from '../stage1/scenery/pond'

export type Prey = { kind: Kind; x: number; y: number; h: number; ang: number; hp: number; wings: boolean; flash: number; seed: number; age: number; gx: number; gy: number; wait: number; fear: number; tired: number; free: number; vx: number; vy: number }

const R = Math.random

export function errand(p: Prey) {
  const k = PREY[p.kind], r = k.land ? 2 : k.zone === 'swarm' ? 0 : 13
  if (k.zone === 'water') do [p.gx, p.gy] = [R() * 300, 222 + R() * 138]; while (depth(p.gx, p.gy) < 6)
  else if (k.zone === 'cross') [p.gx, p.gy] = [40 + R() * (W - 80), 50 + R() * (H - 80)]
  else {
    const list = k.zone === 'swarm' ? SWARMS : k.zone === 'flowers' ? FLOWERS : SITES, [x, y] = list[R() * list.length | 0]
    p.gx = x + (R() - .5) * 2 * r
    p.gy = y + (R() - .5) * 2 * r
  }
}
