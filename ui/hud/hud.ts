import { silent, toggle } from '../../audio/player/music'
import { sound } from '../../audio/player/sound'
import type { Ctx } from '../../core/screen/canvas'
import { save } from '../../core/save/save'
import { QUESTS, REVEAL } from '../../data/game/quests'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { blood } from '../blood/blood'
import { gain } from '../blood/gain'
import { devConsole, type Tool } from '../dev/console'
import { feastButton, SPOT } from '../feast/button'
import { meter } from '../mutate/meter'
import { offer } from '../mutate/offer'
import { nav } from '../nav/nav'
import { note } from '../parts/note'
import { soundBox } from '../nav/sound'
import { pop } from '../quest/pop'
import { flash, life, owing } from '../hint/life'
import { lit, owed, quest, since } from '../quest/quest'
import { text } from '../text/text'
import { picker } from '../track/picker'
import { nextWild } from '../wild/next'
import { now } from '../track/track'

const GATE = QUESTS.findIndex(q => q.kind === 'feast'), age = () => save.quest > GATE ? 9 : save.quest === GATE ? since() - REVEAL : -1

export function hud(pause: () => void, options: () => void, feast: () => void, stay: () => void, buy: () => void, mutate: () => void, tools: Tool[]) {
  const bar = nav([toggle, pause, options]), levels = soundBox((x, y) => !bar.at(x, y)), songs = picker(W - 73), meal = feastButton(feast, stay), dev = devConsole(tools), wild = nextWild(buy), gene = offer(mutate), fill = meter(), parts = [levels, songs, bar, meal, wild, gene, fill], change = gain()
  let exact = false, out = false
  const live = (p: typeof parts[number]) => p !== meal || age() >= 0
  return {
    hover(x: number, y: number) {
      const held = dev.hover(x, y)
      if (held) x = y = -9
      exact = !held && x < 72 && y < 28
      const on = parts.map(p => live(p) && p.hover(x, y)).some(Boolean)
      if (levels.open()) songs.shut()
      return on || held
    },
    click: (x: number, y: number) => dev.click(x, y) || parts.some(p => live(p) && p.click(x, y)),
    lift: () => (dev.lift(), meal.lift()),
    draw(g: Ctx, paused: boolean, bonus = 0, left = 0, born = 9) {
      const u = age()
      if (u >= 0 && u < .3 && !out) sound('cork')
      out = u >= 0
      const shown = save.blood - owed() - owing(), edge = blood(g, shown, exact, bonus, left, lit() || flash())
      change(g, shown, edge + 6, 19)
      life(g, edge)
      quest(g, born)
      wild.draw(g)
      gene.draw(g)
      fill.draw(g)
      bar.draw(g, paused, silent())
      now(g, W - 73)
      if (out) pop(g, u, meal.draw, SPOT)
      songs.draw(g)
      levels.draw(g)
      if (exact) note(g, ['Lifeblood'], edge + 6, 6)
      dev.draw(g)
      if (paused) text(g, 'Paused', W / 2, H / 2 + 7, UI.text, 'c', UI.panel, 2)
    },
  }
}
