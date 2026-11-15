import { present, world } from './display'
import type { Scene } from './scene'

let scene: Scene, t = 0, last = -1

export const current = () => scene

function frame(now: number) {
  requestAnimationFrame(frame)
  const dt = last < 0 ? 0 : Math.max(0, Math.min(.05, (now - last) / 1000))
  last = now
  scene.update(dt, t += dt)
  scene.draw(world, t)
  present()
}

export function start(s: Scene) {
  scene = s
  s.enter()
  requestAnimationFrame(frame)
}
