import { silent, toggle } from '../../audio/player/music'
import { sound } from '../../audio/player/sound'
import type { Ctx } from '../../core/screen/canvas'
import { save } from '../../core/save/save'
import { QUESTS, REVEAL } from '../../data/game/quests'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { blood } from '../blood/blood'
import { devConsole, type Tool } from '../dev/console'
import { feastButton, SPOT } from '../feast/button'
import { nav } from '../nav/nav'
import { soundBox } from '../nav/sound'
import { pop } from '../quest/pop'
import { lit, owed, quest, since } from '../quest/quest'
import { text } from '../text/text'
import { picker } from '../track/picker'
import { nextWild } from '../wild/next'
import { now } from '../track/track'

const GATE = QUESTS.findIndex(q => q.kind === 'feast'), age = () => save.quest > GATE ? 9 : save.quest === GATE ? since() - REVEAL : -1

export function hud(pause: () => void, options: () => void, feast: () => void, buy: () => void, tools: Tool[]) {
  const bar = nav([toggle, pause, options]), levels = soundBox((x, y) => !bar.at(x, y)), songs = picker(W - 73), meal = feastButton(feast), dev = devConsole(tools), wild = nextWild(buy), parts = [levels, songs, bar, meal, dev, wild]
  let exact = false, out = false
  const live = (p: typeof parts[number]) => p !== meal || age() >= 0
  return {
    hover(x: number, y: number) {
      exact = x < 72 && y < 28
      const on = parts.map(p => live(p) && p.hover(x, y)).some(Boolean)
      if (levels.open()) songs.shut()
      return on
    },
    click: (x: number, y: number) => parts.some(p => live(p) && p.click(x, y)),
    draw(g: Ctx, paused: boolean, bonus = 0, left = 0, born = 9) {
      const u = age()
      if (u >= 0 && u < .3 && !out) sound('cork')
      out = u >= 0
      blood(g, save.blood - owed(), exact, bonus, left, lit())
      quest(g, born)
      wild.draw(g)
      bar.draw(g, paused, silent())
      now(g, W - 73)
      dev.draw(g)
      if (out) pop(g, u, meal.draw, SPOT)
      songs.draw(g)
      levels.draw(g)
      if (paused) text(g, 'Paused', W / 2, H / 2 + 7, UI.text, 'c', UI.panel, 2)
    },
  }
}
