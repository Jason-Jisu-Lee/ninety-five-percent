import { hush } from '../../audio/player/music'
import { sound } from '../../audio/player/sound'
import { shade, veil } from '../../core/draw/dissolve'
import type { Scene } from '../../core/loop/scene'
import { due, shed } from '../../core/save/mutate'
import { progress, save, store } from '../../core/save/save'
import { QUESTS } from '../../data/game/quests'
import { LUNGE, STREAK } from '../../data/dragonfly/fight'
import { FLY } from '../../data/dragonfly/flight'
import { NEWS } from '../../data/game/hints'
import { DUSK, RECALL } from '../../data/game/map'
import { age, teach } from '../../ui/hint/life'
import { unlocked } from '../../ui/hint/unlock'
import { glow, tick } from '../../ui/track/track'
import { input } from './input'
import { flee, layers, story, title, top, ui } from './menus'
import { evos, fate, genes, herald, mourn, omen } from './notices'
import { render } from './render'
import { advance, asleep, born, bound, reveal } from './opening'
import { onward, restart, run } from './run'
import { G } from './state'

const lunging = () => QUESTS[save.quest]?.kind === 'lunge'

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
    const first = !Object.keys(save.caught).length, was = save.blood, h = sim.held
    for (let i = 0; i < run.rate; i++) sim.step(dt, G.clock += dt)
    if (due()) genes.open()
    const hurt = sim.health < G.hale
    Object.assign(G, { hale: sim.health, cut: G.cut + dt, lit: G.lit + dt })
    if (G.cast >= 0 && (hurt || sim.away)) [G.part, G.cast, G.cut] = [G.cast / RECALL.time, -1, sim.away ? 9 : 0]
    else if (G.cast >= 0 && (G.cast += dt * run.rate) >= RECALL.time) [G.cast, G.lit] = [-1, 0], flee()
    if (first && h && Object.keys(save.caught).length) teach(h.x, h.y - h.h * .7, save.blood - was)
    age(dt)
    if (sim.jolt) [sim.jolt, G.halt] = [false, LUNGE.freeze], sound('thump'), progress('lunge')
    if (sim.spent) {
      sim.spent = false
      sound('tired')
      if (!save.tired) [save.tired, G.weary] = [true, 0]
    }
    if (G.news >= 0 && (G.news += dt) > NEWS.wait + NEWS.hold) G.news = -1
    if (G.back < 0 && G.back + dt >= 0) sound('cork')
    G.back += dt
    if (G.weary >= 0 && ((G.weary += dt), !sim.rest)) G.weary = -1
    if (sim.fell) mourn()
    sim.fell = false
    if (!sim.away || sim.fly.x > -FLY.gone) G.dusk = Math.max(0, G.dusk - dt / DUSK)
    else if ((G.dusk += dt / DUSK) >= 1) sim.onward ? onward() : (shed(), evos.open(0, () => (save.fed = true, herald(() => {
      restart(true)
      if (!save.told) [save.told, G.news] = [true, 0]
      if (lunging()) G.back = -DUSK
    }))))
    save.time += dt * run.rate
    if ((G.kept += dt) < 5) return
    G.kept = 0
    store()
  },
  draw(g) {
    render(g, run.sim, G.clock, G.fade <= 0 && !asleep(), top() ? null : G.hot, G.me && !top(), !save.caught.fruitfly && !bound(), G.weary)
    if (G.fade > 0) title.draw(g, G.fade)
    else {
      ui.draw(g, run.paused, run.sim.chain, 1 - run.sim.since / STREAK.time, lunging() && !save.fed ? -1 : Math.min(born(), G.back))
      if (G.news >= NEWS.wait) unlocked(g, G.news - NEWS.wait)
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
