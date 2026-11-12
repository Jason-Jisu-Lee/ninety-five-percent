import { vnoise } from '../../core/noise'
import { rng } from '../../core/rng'
import { DF, FLIGHT } from '../../data/dragonfly'
import { H, W } from '../../data/screen'

type State = keyof typeof FLIGHT

export function flight() {
  const R = rng(77), f = { x: 250, y: 150, ang: 0, speed: 38, h: 10, state: 'cruise' as State, timer: 2, flap: 0, heading: 4 }
  return Object.assign(f, {
    step(dt: number, t: number) {
      if ((f.timer -= dt) <= 0) {
        const r = R()
        f.state = f.state === 'dart' ? (r < .55 ? 'hover' : 'cruise') : r < .45 ? 'cruise' : r < .68 ? 'dart' : r < .9 ? 'hover' : 'glide'
        f.timer = FLIGHT[f.state][0] + R() * (FLIGHT[f.state][1] - FLIGHT[f.state][0])
        if (f.state === 'dart') f.ang += (R() < .5 ? -1 : 1) * (.6 + R())
      }
      const [, , pace, wander] = FLIGHT[f.state], m = 44
      f.ang += (vnoise(t * .7, 0, 77) - .5) * 4.4 * wander * dt
      if (f.x < m || f.x > W - m || f.y < m || f.y > H - m) {
        const want = Math.atan2(H / 2 - f.y, W / 2 - f.x)
        f.ang += Math.atan2(Math.sin(want - f.ang), Math.cos(want - f.ang)) * Math.min(1, dt * 2.5)
      }
      f.speed += ((pace < 0 ? f.speed * Math.pow(.35, dt) : pace) - f.speed) * Math.min(1, dt * (f.state === 'dart' ? 9 : 3))
      f.x = Math.min(Math.max(f.x + Math.cos(f.ang) * f.speed * dt, 10), W - 10)
      f.y = Math.min(Math.max(f.y + Math.sin(f.ang) * f.speed * dt, 16), H - 8)
      if (f.state !== 'hover' || f.speed > 6) {
        const n = DF.headings
        f.heading = (Math.round(Math.atan2(Math.cos(f.ang), -Math.sin(f.ang)) / 6.2832 * n) % n + n) % n
      }
      f.flap += dt * 4 * DF.flapFrames * (f.state === 'hover' ? 1.25 : 1)
      f.h = 10 + Math.sin(t * 2.1) * 1.2
    },
  })
}
