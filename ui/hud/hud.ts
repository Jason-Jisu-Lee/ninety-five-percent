import { silent } from '../../audio/player/music'
import type { Ctx } from '../../core/screen/canvas'
import { save } from '../../core/save/save'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { blood } from '../blood/blood'
import { devConsole, type Tool } from '../dev/console'
import { feastButton } from '../feast/button'
import { nav } from '../nav/nav'
import { soundBox } from '../nav/sound'
import { lit, owed, quest } from '../quest/quest'
import { text } from '../text/text'
import { picker } from '../track/picker'
import { now } from '../track/track'

export function hud(pause: () => void, options: () => void, feast: () => void, tools: Tool[]) {
  const levels = soundBox(), bar = nav([levels.flip, pause, options]), songs = picker(W - 73), meal = feastButton(feast), dev = devConsole(tools), parts = [levels, songs, bar, meal, dev]
  let exact = false
  return {
    hover(x: number, y: number) {
      exact = x < 72 && y < 28
      return parts.map(p => p.hover(x, y)).some(Boolean)
    },
    click: (x: number, y: number) => parts.some(p => p.click(x, y)),
    draw(g: Ctx, paused: boolean, bonus = 0, left = 0) {
      blood(g, save.blood - owed(), exact, bonus, left, lit())
      quest(g)
      bar.draw(g, paused, silent())
      now(g, W - 73)
      dev.draw(g)
      meal.draw(g)
      songs.draw(g)
      levels.draw(g)
      if (paused) text(g, 'Paused', W / 2, H / 2 + 7, UI.text, 'c', UI.panel, 2)
    },
  }
}
