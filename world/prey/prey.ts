import { turn } from '../../core/angle'
import { vnoise } from '../../core/noise'
import { PREY } from '../../data/prey'
import { H, W } from '../../data/screen'
import { SWARM, TRUNK } from '../../data/stage1'
import { clear } from '../stage1/trunk'

export type Kind = keyof typeof PREY
export type Prey = { kind: Kind; x: number; y: number; h: number; ang: number; hp: number; wings: boolean; flash: number; seed: number; age: number }

export function move(p: Prey, dt: number, t: number, tx: number, ty: number) {
  const k = PREY[p.kind], out = (m: number) => p.x < m || p.x > W - m || p.y < m + 10 || p.y > H - m
  p.h = k.h + Math.sin(t * 3 + p.seed * 9) * 2
  if (p.kind === 'gnat') {
    const far = 1 + 9 * Math.exp(-p.age * 1.6), n = (o: number) => (vnoise(t * 1.4 + p.seed * 50, o, 3) - .5) * 2 * SWARM.r * far
    p.x = SWARM.x + (vnoise(t * .12, 1, 8) - .5) * SWARM.drift * 2 + n(0)
    p.y = SWARM.y + (vnoise(t * .12, 5, 8) - .5) * SWARM.drift + n(7) * .7
    return
  }
  const scared = Math.hypot(p.x - tx, p.y - ty) < k.flee, home = Math.atan2(H / 2 - p.y, W / 2 - p.x)
  const want = out(0) || Math.hypot(p.x - TRUNK.x, p.y - TRUNK.y) < TRUNK.r + 40 ? home : scared ? Math.atan2(p.y - ty, p.x - tx) : out(16) ? home : NaN
  p.ang = want === want ? turn(p.ang, want, 6 * dt) : p.ang + (vnoise(t * k.jink, p.seed * 99, 3) - .5) * k.turn * dt
  const sp = k.speed * (scared ? k.burst : 1) * (.7 + .6 * vnoise(t * 2, p.seed * 31, 4)) * dt
  p.x += Math.cos(p.ang) * sp
  p.y += Math.sin(p.ang) * sp
  clear(p, 8)
}
