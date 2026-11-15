import { veil } from '../../core/draw/dissolve'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { text, width } from '../text/text'
import { menu } from './menu'
import { panel } from './panel'

const BW = 96, BOTTOM = 232, GUARD = 300

export function dialog() {
  let lines: string[] = [], list = menu([], 0, 0), shown = false, since = 0, last = 0
  return {
    shown: () => shown,
    open(say: string[], acts: [string, () => void][]) {
      lines = say
      list = menu(acts.map(([label, run]) => ({
        label, run() {
          shown = false
          run()
        },
      })), W - BW >> 1, BOTTOM - 14)
      last = acts.length - 1
      list.focus(last)
      ;[shown, since] = [true, performance.now()]
    },
    hover: (x: number, y: number) => list.hover(x, y),
    click(x: number, y: number) {
      if (performance.now() - since > GUARD) list.click(x, y)
    },
    key(k: string) {
      if (k === 'Escape') list.focus(last)
      return list.key(k === 'Escape' ? 'Enter' : k)
    },
    draw(g: Ctx) {
      if (!shown) return
      const w = Math.max(200, ...lines.map(l => width(l) + 32)), y = list.top - lines.length * 14 - 20
      veil(g, .5)
      panel(g, W - w >> 1, y, w, BOTTOM - y, UI.border, UI.panel)
      lines.forEach((l, i) => text(g, l, W / 2, y + 20 + i * 14, UI.text, 'c'))
      list.draw(g)
    },
  }
}
