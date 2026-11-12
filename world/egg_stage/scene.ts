import { back } from '../../core/loop'
import type { Scene } from '../../core/scene'
import { EGG, LAYERS } from '../../data/egg'
import { eggCard } from '../../ui/egg_card'
import { hatchBar } from '../../ui/hatch_bar'
import { bubble } from '../bubble'
import { backdrop } from './backdrop'
import { beam } from './beam'
import { demo, rise, type Demo } from './demo'
import { egg } from './egg'
import { motes } from './motes'
import { surface } from './surface'
import { ECY } from './terrain'

let sim: Demo, drift: ReturnType<typeof motes>

export const eggStage: Scene = {
  hz: 10,
  hud: true,
  enter() {
    sim = demo()
    drift = motes()
  },
  update(_, t) {
    sim.step(t)
    drift.step()
  },
  draw(g, ui, t) {
    g.drawImage(backdrop(), 0, 0)
    beam(g, t)
    surface(g, t)
    drift.draw(g, t)
    g.drawImage(egg(sim.phase === 'active'), EGG.x - 30, ECY - 45)
    for (const b of sim.bubbles) bubble(g, Math.round(b.x + Math.sin(b.a * .35) * 2), Math.round(rise(b)))
    hatchBar(ui, LAYERS[0], sim.prog, 0)
    eggCard(ui, sim)
  },
  key: back,
}
