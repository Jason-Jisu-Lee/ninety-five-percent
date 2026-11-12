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

const buttons = menu(MENU.map(({ label, to, exit }) => ({ label, run: () => to ? go(to) : exit && close() })), 362, 254)
let drift: ReturnType<typeof motes>, air: ReturnType<typeof breath>

export const frontPage: Scene = {
  hz: 10,
  enter() {
    drift = motes()
    air = breath()
  },
  update(_, t) {
    drift.step()
    air.step(t)
  },
  draw(g, _, t) {
    g.drawImage(lakebed(), 0, 0)
    caustics(g, t)
    drift.draw(g)
    g.drawImage(egg(Math.max(0, Math.sin(t % 5 / 5 * Math.PI * 2)) ** 2 > .6), EX - 12, EY - 12)
    air.draw(g)
    g.drawImage(logo(), 20, 18)
    buttons.draw(g)
  },
  hover: buttons.hover,
  click: buttons.click,
  key: buttons.key,
}
