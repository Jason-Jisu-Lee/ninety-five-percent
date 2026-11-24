import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { WILD } from '../../data/shop/wild'
import { brackets } from '../../ui/parts/brackets'
import { note } from '../../ui/parts/note'
import { text, width } from '../../ui/text/text'

const WIDE = Math.max(...WILD.map(w => width(w.kind ? w.name : 'Expansion: ' + w.name) + width(String(w.cost)))) + 30
export const SLOTS = [8, 30, WIDE, 32], LINES = ['You can now buy stronger enemies', 'They reset every run'], SAY = 'You can now buy stronger enemies during a run. They reset every run.'
const close = (u: number) => 2 + Math.round(7 * (1 - Math.min(1, u % 1.2 / .4)) ** 2)

export const WAYS: { name: string; note: string; stop?: boolean; draw(g: Ctx, u: number): void }[] = [
  {
    name: 'Callout',
    note: 'A small box pointing at the two slots, with green marks closing in on them. The game keeps running. It stays 6 s',
    draw(g, u) {
      const x = SLOTS[0] + WIDE + 12, y = SLOTS[1] + 4
      brackets(g, SLOTS, close(u))
      note(g, LINES, x, y)
      g.fillStyle = UI.border
      for (let i = 0; i < 5; i++) g.fillRect(x - 1 - i, y + 9 + i - 4, 1, 9 - 2 * i)
    },
  },
  {
    name: 'Marks and two lines',
    note: 'No box. Green marks close in on the slots and two lines of text sit beside them. The game keeps running. It stays 6 s',
    draw(g, u) {
      brackets(g, SLOTS, close(u))
      text(g, LINES[0], SLOTS[0] + WIDE + 12, SLOTS[1] + 13, UI.gold, undefined, UI.panel)
      text(g, LINES[1], SLOTS[0] + WIDE + 12, SLOTS[1] + 25, UI.text, undefined, UI.panel)
    },
  },
  {
    name: 'Title across the screen',
    note: 'A gold title in the place and style of Objective Complete, with green marks on the slots. The game keeps running. It stays 6 s',
    draw(g, u) {
      const half = width('Stronger enemies') + 8
      brackets(g, SLOTS, close(u))
      g.globalAlpha = clamp(Math.min(u / .25, (6 - u) / .4))
      text(g, 'Stronger enemies', W / 2, 72, UI.gold, 'c', UI.panel, 2)
      text(g, 'You can now buy them at the top left', W / 2, 88, UI.text, 'c', UI.panel)
      text(g, LINES[1], W / 2, 100, UI.text, 'c', UI.panel)
      for (const s of [-1, 1]) for (const [col, y] of [[UI.panel, 66], [UI.gold, 65]] as const) {
        g.fillStyle = col
        g.fillRect(W / 2 + s * half + (s < 0 ? -36 : 0), y, 36, 1)
      }
      g.globalAlpha = 1
    },
  },
  {
    name: 'Box with a button',
    note: 'The same box as the Lair question. The game stops until the player presses Got it. Green marks stay on the slots',
    stop: true,
    draw(g, u) {
      brackets(g, SLOTS, close(u))
    },
  },
]
