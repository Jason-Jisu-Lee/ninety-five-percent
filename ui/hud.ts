import { toggle } from '../audio/music'
import type { Ctx } from '../core/canvas'
import { save } from '../core/save'
import { UI } from '../data/palette'
import { H, W } from '../data/screen'
import { energy } from './energy'
import { nav } from './nav'
import { now } from './now'
import { quest } from './quest'
import { statCard } from './stat_card'
import { text } from './text'
import { upgrades } from './upgrades'

export function hud(pause: () => void, options: () => void) {
  const bar = nav([toggle, pause, options]), list = upgrades()
  return {
    flip: list.flip,
    hover(x: number, y: number) {
      const a = bar.hover(x, y), b = list.hover(x, y)
      return a || b
    },
    click: (x: number, y: number) => bar.click(x, y) || list.click(x, y),
    draw(g: Ctx, card: boolean, paused: boolean) {
      energy(g, save.energy)
      list.draw(g)
      if (card) statCard(g, 8, 116)
      quest(g)
      bar.draw(g, paused, !save.music)
      now(g, W - 73, 20)
      if (paused) text(g, 'Paused', W / 2, H / 2 + 7, UI.text, 'c', UI.panel, 2)
    },
  }
}
