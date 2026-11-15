import { turn, wrap } from '../../core/math/angle'
import { save } from '../../core/save/save'
import { DF } from '../../data/dragonfly/body'
import { FLY, VARY } from '../../data/dragonfly/flight'
import { boost } from '../../data/dragonfly/stats'
import { H, W } from '../../data/look/screen'
import { fidget } from './fidget'

export function flight(x: number, y: number) {
  const f = { x, y, ang: -Math.PI / 2, speed: 0, base: FLY.height, h: FLY.height, flap: 0, heading: 0, frame: 0, lean: 0, perched: false }
  const R = Math.random, n = DF.flapFrames, agile = () => boost('agility', save.lv.agility), rest = fidget(f), between = ([a, b]: number[]) => a + R() * (b - a)
  const top = () => FLY.top * boost('speed', save.lv.speed)
  let spin = 0, glide = between(VARY.glide)
  return Object.assign(f, {
    top,
    seek(tx: number, ty: number, max: number, dt: number, th = FLY.height) {
      const d = Math.hypot(tx - f.x, ty - f.y), want = Math.atan2(ty - f.y, tx - f.x), was = f.ang
      if (d > 2) f.ang = turn(f.ang, want, FLY.turn * agile() * dt)
      spin += (wrap(f.ang - was) / (dt || 1) - spin) * Math.min(1, dt * 8)
      f.speed += (Math.min(max, d * FLY.arrive) * Math.max(0, Math.cos(wrap(want - f.ang))) - f.speed) * Math.min(1, dt * FLY.accel * agile())
      f.base += (th - f.base) * Math.min(1, dt * 3)
    },
    step(dt: number, t: number) {
      if (f.perched) rest(dt)
      else {
        const pace = f.speed / top(), calm = Math.abs(spin) < VARY.spin
        f.x = Math.min(Math.max(f.x + Math.cos(f.ang) * f.speed * dt, 10), W - 10)
        f.y = Math.min(Math.max(f.y + Math.sin(f.ang) * f.speed * dt, 16), H - 4)
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
