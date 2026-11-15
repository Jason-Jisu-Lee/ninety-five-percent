import { toggle } from '../../audio/player/music'
import type { Ctx } from '../../core/screen/canvas'
import { save } from '../../core/save/save'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { energy } from '../energy/energy'
import { nav } from '../nav/nav'
import { now } from '../nav/track'
import { quest } from '../quest/quest'
import { statCard } from '../upgrades/card'
import { text } from '../text/text'
import { upgrades } from '../upgrades/upgrades'

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
