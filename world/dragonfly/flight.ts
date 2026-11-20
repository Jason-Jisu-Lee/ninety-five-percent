import { turn, wrap } from '../../core/math/angle'
import { between } from '../../core/math/between'
import { clamp } from '../../core/math/clamp'
import { own } from '../../core/save/save'
import { DF } from '../../data/dragonfly/body'
import { FLY, VARY } from '../../data/dragonfly/flight'
import { H, W } from '../../data/look/screen'
import { fidget } from './fidget'

export function flight(x: number, y: number) {
  const f = { x, y, ang: -Math.PI / 2, speed: 0, base: FLY.height, h: FLY.height, flap: 0, heading: 0, frame: 0, lean: 0, perched: false, out: false }
  const n = DF.flapFrames, [close, open] = FLY.hover, rest = fidget(f)
  const top = () => FLY.top * own('speed')
  let spin = 0, glide = between(VARY.glide)
  function seek(tx: number, ty: number, max: number, dt: number, th = FLY.height) {
    const d = Math.hypot(tx - f.x, ty - f.y), want = Math.atan2(ty - f.y, tx - f.x), was = f.ang, rate = FLY.turn * own('turn')
    if (d > 2) f.ang = turn(f.ang, want, rate * dt)
    const off = wrap(want - f.ang), face = Math.max(0, Math.cos(off)), far = clamp((d - close) / (open - close))
    const goal = Math.min(max, d * FLY.arrive, d * rate * FLY.tight / (Math.abs(Math.sin(off)) + 1e-6)) * (face + (1 - face) * far)
    spin += (wrap(f.ang - was) / (dt || 1) / rate - spin) * Math.min(1, dt * 8)
    f.speed += (goal - f.speed) * Math.min(1, dt * (goal < f.speed ? FLY.brake : FLY.accel * own('accel')))
    f.base += (th - f.base) * Math.min(1, dt * 3)
  }
  return Object.assign(f, {
    top,
    seek,
    chase(p: { x: number; y: number; vx: number; vy: number; h: number }, max: number, dt: number) {
      const lead = Math.min(FLY.lead, Math.hypot(p.x - f.x, p.y - f.y) / top())
      seek(p.x + p.vx * lead, p.y + p.vy * lead, max, dt, p.h)
    },
    step(dt: number, t: number) {
      if (f.perched) rest(dt)
      else {
        const pace = f.speed / top(), calm = Math.abs(spin) < VARY.spin
        f.x = clamp(f.x + Math.cos(f.ang) * f.speed * dt, f.out ? -99 : 10, W - 10)
        f.y = clamp(f.y + Math.sin(f.ang) * f.speed * dt, 16, H - 4)
        f.flap += dt * FLY.beat * n * (VARY.hover - (VARY.hover - 1) * Math.min(1, pace * 2))
        f.lean = calm ? 0 : Math.sign(spin)
        if ((glide -= dt) < -between(VARY.hold) || !calm || pace < .35) glide = between(VARY.glide)
        f.frame = glide < 0 ? n + 3 : Math.floor(f.flap) % n
      }
      f.heading = (Math.round((f.ang + Math.PI / 2) / (2 * Math.PI) * DF.headings) % DF.headings + DF.headings) % DF.headings
      f.h += (f.base + (f.perched ? 0 : Math.sin(t * 2.1) * FLY.bob) - f.h) * Math.min(1, dt * 10)
    },
  })
}

export type Flight = ReturnType<typeof flight>
