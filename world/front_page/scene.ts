import { go } from '../../core/loop'
import type { Scene } from '../../core/scene'
import { MENU } from '../../data/menu'
import { logo } from '../../ui/logo'
import { menu } from '../../ui/menu'
import { breath } from './breath'
import { caustics } from './caustics'
import { egg, EX, EY } from './egg'
import { lakebed } from './lakebed'
import { motes } from './motes'

const items = menu(MENU.map(m => ({ label: m.label, run: () => m.to ? go(m.to) : m.exit && close() })), 362, 254)
let m: ReturnType<typeof motes>, b: ReturnType<typeof breath>

export const frontPage: Scene = {
  hz: 10,
  enter() {
    m = motes()
    b = breath()
  },
  update(_, t) {
    m.step()
    b.step(t)
  },
  draw(g, _, t) {
    g.drawImage(lakebed(), 0, 0)
    caustics(g, t)
    m.draw(g)
    g.drawImage(egg(Math.max(0, Math.sin(t % 5 / 5 * Math.PI * 2)) ** 2 > .6), EX - 12, EY - 12)
    b.draw(g)
    g.drawImage(logo(), 20, 18)
    items.draw(g)
  },
  hover: items.hover,
  click: items.click,
  key: items.key,
}
