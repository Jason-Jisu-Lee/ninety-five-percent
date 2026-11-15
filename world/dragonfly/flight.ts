import { turn, wrap } from '../../core/angle'
import { save } from '../../core/save'
import { DF, FLY } from '../../data/dragonfly'
import { H, W } from '../../data/screen'
import { boost } from '../../data/stats'

export function flight(x: number, y: number) {
  const f = { x, y, ang: -Math.PI / 2, speed: 0, base: FLY.height, h: FLY.height, flap: 0, heading: 0, perched: false }
  const agile = () => boost('agility', save.lv.agility)
  return Object.assign(f, {
    top: () => FLY.top * boost('speed', save.lv.speed),
    seek(tx: number, ty: number, max: number, dt: number, th = FLY.height) {
      const d = Math.hypot(tx - f.x, ty - f.y), want = Math.atan2(ty - f.y, tx - f.x)
      if (d > 2) f.ang = turn(f.ang, want, FLY.turn * agile() * dt)
      f.speed += (Math.min(max, d * FLY.arrive) * Math.max(0, Math.cos(wrap(want - f.ang))) - f.speed) * Math.min(1, dt * FLY.accel * agile())
      f.base += (th - f.base) * Math.min(1, dt * 3)
    },
    step(dt: number, t: number) {
      if (!f.perched) {
        f.x = Math.min(Math.max(f.x + Math.cos(f.ang) * f.speed * dt, 10), W - 10)
        f.y = Math.min(Math.max(f.y + Math.sin(f.ang) * f.speed * dt, 16), H - 4)
        f.flap += dt * FLY.beat * DF.flapFrames * (f.speed < 20 ? 1.25 : 1)
      }
      f.heading = (Math.round((f.ang + Math.PI / 2) / (2 * Math.PI) * DF.headings) % DF.headings + DF.headings) % DF.headings
      f.h += (f.base + (f.perched ? 0 : Math.sin(t * 2.1) * FLY.bob) - f.h) * Math.min(1, dt * 10)
    },
  })
}

export type Flight = ReturnType<typeof flight>
