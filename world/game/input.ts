import { toggle } from '../../audio/player/music'
import type { Scene } from '../../core/loop/scene'
import { opts, story, title, top, ui } from './menus'
import { attack, fate, inspect, omen, self } from './notices'
import { run } from './run'
import { G } from './state'

const DEV = import.meta.env.DEV
const onFly = (x: number, y: number) => Math.hypot(x - run.sim.fly.x, y - run.sim.fly.y + run.sim.fly.h * .7) < 13

export const input: Pick<Scene, 'hover' | 'click' | 'key'> = {
  hover(x, y) {
    const was = G.hot
    G.me = false
    if (story.on() || fate.on() || omen.on()) return false
    if (top()) return top()!.hover(x, y)
    if (G.fade > 0) return title.hover(x, y)
    G.hot = null
    if (ui.hover(x, y)) return true
    G.hot = run.sim.prey.at(x, y, was)
    G.me = !G.hot && onFly(x, y)
    return !!G.hot || G.me
  },
  click(x, y) {
    if (story.on()) return void (DEV && story.next())
    if (omen.on()) return void (DEV && omen.next())
    if (fate.on()) return
    if (top()) return top()!.click(x, y)
    if (G.fade > 0) return void title.click(x, y)
    if (ui.click(x, y) || inspect(run.sim.prey.at(x, y, G.hot))) return
    if (onFly(x, y)) self.open()
    else if (!run.paused) run.sim.mark = null
  },
  key(k) {
    if (story.on()) return DEV && (k === 'Escape' ? story.skip() : story.next()), true
    if (omen.on()) return DEV && omen.next(), true
    if (fate.on()) return true
    if (top()) return top()!.key(k)
    if (k === 'm') return toggle(), true
    if (G.fade > 0) return title.key(k)
    if (k === 'a') return attack(G.hot), false
    if (k === 's') return run.sim.dart(), false
    if (k === 'Escape') opts.open(true)
    else if (k === 'p' || k === ' ') run.paused = !run.paused
    else return false
    return true
  },
}
