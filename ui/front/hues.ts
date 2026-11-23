import { save, store } from '../../core/save/save'
import { reach } from '../../core/save/wild'
import type { Ctx } from '../../core/screen/canvas'
import { COLORS, HUES } from '../../data/dragonfly/colors'
import { UI } from '../../data/look/palette'
import { H } from '../../data/look/screen'
import { note } from '../parts/note'
import { box } from '../parts/panel'
import { width } from '../text/text'

const S = 12, GAP = 6, X = 22, Y = H - 16 - S

export function hues() {
  let hot = -1
  const list = () => HUES.filter(h => reach() >= h[2]), left = (i: number) => X + i * (S + GAP)
  const at = (x: number, y: number) => y >= Y - 2 && y < Y + S + 2 ? list().findIndex((_, i) => x >= left(i) - 2 && x < left(i) + S + 2) : -1
  return {
    hover: (x: number, y: number) => (hot = at(x, y)) >= 0,
    click(x: number, y: number) {
      const h = list()[at(x, y)]
      if (!h) return false
      save.color = h[0]
      store()
      return true
    },
    draw(g: Ctx) {
      list().forEach(([color], i) => {
        const x = left(i), on = save.color === color
        if (on || i === hot) {
          box(g, x - 3, Y - 3, S + 6, S + 6, i === hot ? UI.accent : UI.border, UI.border)
          g.clearRect(x - 2, Y - 2, S + 4, S + 4)
        }
        box(g, x - 1, Y - 1, S + 2, S + 2, UI.panel, UI.panel)
        box(g, x, Y, S, S, COLORS[color][0], COLORS[color][0])
      })
      const h = list()[hot], lines = h?.[3] ? [h[1], h[3]] : [h?.[1] ?? '']
      if (h) note(g, lines, Math.max(4, left(hot) + S / 2 - Math.max(...lines.map(width)) / 2 - 5), Y - 6, false, true)
    },
  }
}
