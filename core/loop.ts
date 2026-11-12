import { UH, UW } from '../data/screen'
import { present, ui, world } from './display'
import { still } from './motion'
import type { Scene, SceneId } from './scene'

let scenes: Record<SceneId, Scene>, scene: Scene
let n = 0, t = 0, acc = 0, last = -1, dirty = true

export const current = () => scene
export const redraw = () => { dirty = true }
export const back = (k: string) => k === 'Escape' && (go('front_page'), true)

export function go(id: SceneId) {
  scene = scenes[id]
  n = t = acc = 0
  scene.enter()
  dirty = true
}

function frame(now: number) {
  requestAnimationFrame(frame)
  const dt = last < 0 ? 0 : Math.max(0, Math.min(.05, (now - last) / 1000)), hz = scene.hz
  last = now
  if (!hz) {
    scene.update(dt, t += dt)
    dirty = true
  } else if (!(still && n)) for (acc += dt; acc >= 1 / hz; acc -= 1 / hz, dirty = true) scene.update(1 / hz, t = ++n / hz)
  if (!dirty) return
  dirty = false
  if (scene.hud) ui.clearRect(0, 0, UW, UH)
  scene.draw(world, ui, t)
  present(scene.hud)
}

export function start(all: Record<SceneId, Scene>, first: SceneId) {
  scenes = all
  go(first)
  requestAnimationFrame(frame)
}
