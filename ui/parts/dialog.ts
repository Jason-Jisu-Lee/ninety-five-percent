import type { Ctx } from '../../core/screen/canvas'
import { FOREST, UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { text, width } from '../text/text'
import { wrap } from '../text/wrap'
import { box } from './panel'

const BW = 54, BH = 15, GAP = 8, TOP = 240, WIDE = 230, GUARD = 300

export function dialog() {
  let lines: string[] = [], acts: [string, () => void][] = [], sel = 0, shown = false, since = 0
  const h = () => lines.length * 12 + BH + 21, bx = (i: number) => (W - acts.length * BW - (acts.length - 1) * GAP >> 1) + i * (BW + GAP)
  const at = (x: number, y: number) => y >= TOP + h() - BH - 6 && y < TOP + h() - 6 ? acts.findIndex((_, i) => x >= bx(i) && x < bx(i) + BW) : -1
  const run = (i: number) => {
    shown = false
    acts[i][1]()
  }
  return {
    shown: () => shown,
    open(say: string[], list: [string, () => void][]) {
      lines = say.flatMap(l => wrap(l, WIDE))
      acts = list
      sel = list.length - 1
      ;[shown, since] = [true, performance.now()]
    },
    hover(x: number, y: number) {
      const i = at(x, y)
      if (i >= 0) sel = i
      return i >= 0
    },
    click(x: number, y: number) {
      const i = at(x, y)
      if (i >= 0 && performance.now() - since > GUARD) run(i)
    },
    key(k: string) {
      const d = k === 'ArrowRight' || k === 'd' ? 1 : k === 'ArrowLeft' || k === 'a' ? -1 : 0
      if (d) sel = (sel + d + acts.length) % acts.length
      else if (k === 'Escape') run(acts.length - 1)
      else if (k === 'Enter' || k === ' ') run(sel)
      return true
    },
    draw(g: Ctx) {
      if (!shown) return
      const w = Math.max(...lines.map(width), acts.length * (BW + GAP)) + 24, y = TOP, by = y + h() - BH - 6
      box(g, W - w >> 1, y, w, h(), UI.dim, FOREST.deep)
      lines.forEach((l, i) => text(g, l, W / 2, y + 15 + i * 12, UI.text, 'c'))
      acts.forEach(([label], i) => {
        box(g, bx(i), by, BW, BH, i === sel ? UI.accent : UI.border, UI.panel)
        text(g, label, bx(i) + BW / 2, by + 11, i === sel ? UI.accent : UI.text, 'c')
      })
    },
  }
}
