import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { brackets } from '../../ui/parts/brackets'
import { orb } from '../../ui/parts/icons'
import { note } from '../../ui/parts/note'
import { text, width } from '../../ui/text/text'

export const HOLD = 5, LINES = ['Lifeblood', 'Killing prey gives lifeblood']
const close = (u: number) => 2 + Math.round(7 * (1 - Math.min(1, u % 1.2 / .4)) ** 2), fade = (u: number) => clamp(Math.min(u / .25, (HOLD - u) / .4))

type Way = { name: string; note: string; late?: number; draw(g: Ctx, u: number, at: number[], from: number[]): void }

export const WAYS: Way[] = [
  {
    name: 'Callout',
    note: 'A small box under the counter pointing up at it, with green marks closing in on the counter. The game keeps running',
    draw(g, u, at) {
      const x = at[0], y = at[1] + at[3] + 12
      brackets(g, at, close(u))
      g.globalAlpha = fade(u)
      note(g, LINES, x, y)
      g.fillStyle = UI.border
      for (let i = 0; i < 4; i++) g.fillRect(x + 8 - i, y - 4 + i, 1 + 2 * i, 1)
      g.globalAlpha = 1
    },
  },
  {
    name: 'Marks and two lines',
    note: 'No box. Green marks close in on the counter and two lines sit to its right. The game keeps running',
    draw(g, u, at) {
      brackets(g, at, close(u))
      g.globalAlpha = fade(u)
      text(g, LINES[0], at[0] + at[2] + 24, at[1] + 9, UI.gold, undefined, UI.panel)
      text(g, LINES[1], at[0] + at[2] + 24, at[1] + 21, UI.text, undefined, UI.panel)
      g.globalAlpha = 1
    },
  },
  {
    name: 'Title across the screen',
    note: 'A gold title in the place and style of Objective Complete and Stronger enemies, with green marks on the counter. The game keeps running',
    draw(g, u, at) {
      const half = width(LINES[0]) + 8
      brackets(g, at, close(u))
      g.globalAlpha = fade(u)
      text(g, LINES[0], W / 2, 72, UI.gold, 'c', UI.panel, 2)
      text(g, LINES[1], W / 2, 88, UI.text, 'c', UI.panel)
      text(g, 'Shown at the top left', W / 2, 100, UI.text, 'c', UI.panel)
      for (const s of [-1, 1]) for (const [col, y] of [[UI.panel, 66], [UI.gold, 65]] as const) {
        g.fillStyle = col
        g.fillRect(W / 2 + s * half + (s < 0 ? -36 : 0), y, 36, 1)
      }
      g.globalAlpha = 1
    },
  },
  {
    name: 'Drop flies to the counter',
    late: .6,
    note: 'A blood drop flies from the kill to the counter in 0.6 s, and the counter goes up when it lands. Then the same box as 1 opens beside the counter. No marks. The game keeps running',
    draw(g, u, at, [fx, fy]) {
      const k = Math.min(1, u / .6), e = k * k * (3 - 2 * k), tx = at[0] + 3, ty = at[1] + 4
      if (k < 1) return orb(g, Math.round(fx + (tx - fx) * e), Math.round(fy + (ty - fy) * e - Math.sin(e * Math.PI) * 30), '', UI.panel)
      g.globalAlpha = fade(u)
      note(g, LINES, at[0] + at[2] + 30, at[1] - 2)
      g.globalAlpha = 1
    },
  },
]
