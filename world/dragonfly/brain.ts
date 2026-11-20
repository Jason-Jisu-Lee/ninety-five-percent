import { between } from '../../core/math/between'
import { FLY, ROAM } from '../../data/dragonfly/flight'
import { H, W } from '../../data/look/screen'
import type { Flight } from './flight'

export function brain(fly: Flight) {
  let gx = fly.x, gy = fly.y, wait = 0
  return (dt: number) => {
    if (Math.hypot(gx - fly.x, gy - fly.y) < ROAM.near && (wait -= dt) <= 0) {
      wait = between(ROAM.pause)
      do {
        const a = Math.random() * 6.283, d = between(ROAM.hop)
        ;[gx, gy] = [fly.x + Math.cos(a) * d, fly.y + Math.sin(a) * d]
      } while (gx < ROAM.pad || gx > W - ROAM.pad || gy < ROAM.top || gy > H - ROAM.pad)
    }
    fly.seek(gx, gy, fly.top() * FLY.cruise, dt)
  }
}
