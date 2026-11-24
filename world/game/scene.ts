import { hush } from '../../audio/player/music'
import { sound } from '../../audio/player/sound'
import { shade, veil } from '../../core/draw/dissolve'
import type { Scene } from '../../core/loop/scene'
import { save, store } from '../../core/save/save'
import { LUNGE, STREAK } from '../../data/dragonfly/fight'
import { FLY } from '../../data/dragonfly/flight'
import { DUSK } from '../../data/game/map'
import { glow, tick } from '../../ui/track/track'
import { input } from './input'
import { layers, story, title, top, ui } from './menus'
import { evos, fate, herald, mourn, omen } from './notices'
import { render } from './render'
import { advance, asleep, born, bound, reveal } from './opening'
import { onward, restart, run } from './run'
import { G } from './state'

export const stage1: Scene = {
  enter: restart,
  update(dt) {
    tick(dt)
    story.update(dt)
    fate.update(dt)
    omen.update(dt)
    const { sim } = run, still = sim.away || evos.shown()
    if (still !== G.calm) hush(G.calm = still, false)
    if (G.fade > 0) return void (G.frozen || sim.idle(dt, G.clock += dt))
    if (advance(dt)) return
    if (fate.on() || omen.on()) return sim.idle(dt, G.clock += dt)
    if (run.paused || top() || (G.halt -= dt) > 0) return
    for (let i = 0; i < run.rate; i++) sim.step(dt, G.clock += dt)
    if (sim.jolt) [sim.jolt, G.halt] = [false, LUNGE.freeze], sound('thump')
    if (sim.spent) sim.spent = false, sound('tired')
    if (sim.held?.kind === 'fruitfly') save.taught = true
    if (sim.fell) mourn()
    sim.fell = false
    if (!sim.away || sim.fly.x > -FLY.gone) G.dusk = Math.max(0, G.dusk - dt / DUSK)
    else if ((G.dusk += dt / DUSK) >= 1) sim.onward ? onward() : evos.open(0, () => herald(() => restart(true)))
    save.time += dt * run.rate
    if ((G.kept += dt) < 5) return
    G.kept = 0
    store()
  },
  draw(g) {
    render(g, run.sim, G.clock, G.fade <= 0 && !asleep(), top() ? null : G.hot, G.me && !top(), !save.taught && !bound())
    if (G.fade > 0) title.draw(g, G.fade)
    else {
      ui.draw(g, run.paused, run.sim.chain, 1 - run.sim.since / STREAK.time, born())
      if (G.dusk > 0) veil(g, Math.min(1, G.dusk))
    }
    story.draw(g)
    for (let i = layers.length; i--;) layers[i].draw(g)
    fate.draw(g)
    omen.draw(g)
  },
  over(g, k) {
    const dark = shade.n
    shade.n = 0
    if (G.fade > 0) title.over(g, k, G.fade, dark)
    glow(g, k, evos.shown() ? 0 : G.fade > 0 ? G.fade : 1, dark)
    reveal(g, k)
  },
  ...input,
}
