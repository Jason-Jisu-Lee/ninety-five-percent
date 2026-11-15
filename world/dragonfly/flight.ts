import { turn, wrap } from '../../core/angle'
import { DF, FLY } from '../../data/dragonfly'
import { H, W } from '../../data/screen'
import { clear } from '../stage1/trunk'

export function flight(x: number, y: number) {
  const f = { x, y, ang: -Math.PI / 2, speed: 0, base: FLY.height, h: FLY.height, flap: 0, heading: 0 }
  return Object.assign(f, {
    seek(tx: number, ty: number, max: number, dt: number, th = FLY.height) {
      const d = Math.hypot(tx - f.x, ty - f.y), want = Math.atan2(ty - f.y, tx - f.x)
      if (d > 2) f.ang = turn(f.ang, want, FLY.turn * dt)
      f.speed += (Math.min(max, d * FLY.arrive) * Math.max(0, Math.cos(wrap(want - f.ang))) - f.speed) * Math.min(1, dt * FLY.accel)
      f.base += (th - f.base) * Math.min(1, dt * 3)
    },
    step(dt: number, t: number) {
      f.x = Math.min(Math.max(f.x + Math.cos(f.ang) * f.speed * dt, 12), W - 12)
      f.y = Math.min(Math.max(f.y + Math.sin(f.ang) * f.speed * dt, 26), H - 6)
      clear(f, 34)
      f.heading = (Math.round((f.ang + Math.PI / 2) / (2 * Math.PI) * DF.headings) % DF.headings + DF.headings) % DF.headings
      f.flap += dt * FLY.beat * DF.flapFrames * (f.speed < 20 ? 1.25 : 1)
      f.h = f.base + Math.sin(t * 2.1) * FLY.bob
    },
  })
}
