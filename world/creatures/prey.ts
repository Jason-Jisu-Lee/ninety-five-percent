import { turn } from '../../core/angle'
import { vnoise } from '../../core/noise'
import { PREY } from '../../data/stage1/enemies'
import { H, W } from '../../data/screen'
import { COVER, FLOWERS, SITES, SWARM, SWARMS } from '../../data/stage1/scene'
import { depth } from '../stage1/pond'

export type Kind = keyof typeof PREY
export type Prey = { kind: Kind; x: number; y: number; h: number; ang: number; hp: number; wings: boolean; flash: number; seed: number; age: number; gx: number; gy: number; wait: number; fear: number; tired: number; free: number; vx: number; vy: number }

const R = Math.random

export function errand(p: Prey) {
  const k = PREY[p.kind], r = k.land ? 2 : k.zone === 'swarm' ? 0 : 13
  if (k.zone === 'water') do [p.gx, p.gy] = [R() * 280, 236 + R() * 120]; while (depth(p.gx, p.gy) < 6)
  else if (k.zone === 'cross') [p.gx, p.gy] = [40 + R() * (W - 80), 50 + R() * (H - 80)]
  else {
    const list = k.zone === 'swarm' ? SWARMS : k.zone === 'flowers' ? FLOWERS : SITES, [x, y] = list[R() * list.length | 0]
    p.gx = x + (R() - .5) * 2 * r
    p.gy = y + (R() - .5) * 2 * r
  }
}

export function move(p: Prey, dt: number, t: number, tx: number, ty: number) {
  const k = PREY[p.kind]
  p.free -= dt
  p.fear -= dt
  p.tired -= dt
  if (k.zone === 'swarm') {
    const far = 1 + 9 * Math.exp(-p.age * 1.6), n = (o: number) => (vnoise(t * 1.4 + p.seed * 50, o, 3) - .5) * 2 * SWARM.r * far
    p.x = p.gx + (vnoise(t * .12 + p.gx, 1, 8) - .5) * SWARM.drift * 2 + n(0)
    p.y = p.gy + (vnoise(t * .12 + p.gx, 5, 8) - .5) * SWARM.drift + n(7) * .7
    p.h = k.h + Math.sin(t * 3 + p.seed * 9) * 2
    return false
  }
  if (k.stay && p.age > k.stay) [p.gx, p.gy] = [p.x < W / 2 ? -60 : W + 60, p.y]
  const dx = p.x - tx, dy = p.y - ty, near = Math.hypot(dx, dy), gd = Math.hypot(p.gx - p.x, p.gy - p.y), sat = p.wait > 0 && gd < 4
  if (near < k.flee * (sat && k.land ? .7 : 1) && p.tired <= 0) {
    const a = Math.atan2(dy, dx) + (R() < .5 ? 1 : -1) * (1 + R() * .6)
    p.fear = k.wind
    p.tired = k.wind + k.tire * (.5 + R())
    p.wait = 0
    if (k.dodge) [p.gx, p.gy, p.ang] = [Math.min(Math.max(p.x + Math.cos(a) * k.dodge, 12), W - 12), Math.min(Math.max(p.y + Math.sin(a) * k.dodge, 24), H - 8), a]
  }
  let want = Math.atan2(p.gy - p.y, p.gx - p.x), sp = k.speed * (k.sit ? Math.min(1, .25 + gd / 24) : 1), low = false
  if (!k.dodge && (p.fear > 0 || near < k.flee * 1.5)) {
    let reach = k.cover
    want = Math.atan2(dy, dx)
    sp = p.fear > 0 ? k.fast : k.speed
    for (const [cx, cy] of COVER) {
      const d = Math.hypot(cx - p.x, cy - p.y)
      if (d < reach && (cx - p.x) * dx + (cy - p.y) * dy > 0) [reach, want] = [d, Math.atan2(cy - p.y, cx - p.x)]
    }
    if (k.cover && reach < 5) return true
  } else if (p.fear > 0) sp = k.fast
  else if (sat) {
    sp = 0
    low = !!k.land
    if ((p.wait -= dt) <= 0) errand(p)
  } else if (gd < (k.sit ? 4 : 16)) {
    if (k.sit) p.wait = k.sit * (.5 + R())
    else errand(p)
  } else low = !!k.land && gd < 16
  if (sp) {
    p.ang = turn(p.ang, want + (vnoise(t * 3, p.seed * 99, 3) - .5) * 2 * k.jink, k.turn * dt)
    sp *= (.75 + .5 * vnoise(t * 2, p.seed * 31, 4)) * dt
    p.x += Math.cos(p.ang) * sp
    p.y += Math.sin(p.ang) * sp
  }
  p.h += ((low ? 2 : k.h + Math.sin(t * 3 + p.seed * 9) * 2) - p.h) * Math.min(1, dt * 7)
  return p.x < -24 || p.x > W + 24 || p.y < -24 || p.y > H + 24
}
