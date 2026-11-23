import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
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
      sel = -1
      ;[shown, since] = [true, performance.now()]
    },
    hover(x: number, y: number) {
      return (sel = at(x, y)) >= 0
    },
    click(x: number, y: number) {
      const i = at(x, y)
      if (i >= 0 && performance.now() - since > GUARD) run(i)
    },
    key(k: string) {
      const d = k === 'ArrowRight' || k === 'd' ? 1 : k === 'ArrowLeft' || k === 'a' ? -1 : 0
      if (d) sel = sel < 0 ? d > 0 ? 0 : acts.length - 1 : (sel + d + acts.length) % acts.length
      else if (k === 'Escape') run(acts.length - 1)
      else if ((k === 'Enter' || k === ' ') && sel >= 0) run(sel)
      return true
    },
    draw(g: Ctx) {
      if (!shown) return
      const w = Math.max(...lines.map(width), acts.length * (BW + GAP)) + 24, x = W - w >> 1, y = TOP, by = y + h() - BH - 6
      g.globalAlpha = .8
      g.fillStyle = UI.panel
      g.fillRect(x + 2, y, w - 4, h())
      for (const i of [0, 1]) for (const e of [x + i, x + w - 1 - i]) g.fillRect(e, y + 2 - i, 1, h() - 4 + 2 * i)
      g.globalAlpha = 1
      g.fillStyle = UI.dim
      g.fillRect(x + 1, y, w - 2, 1)
      lines.forEach((l, i) => text(g, l, W / 2, y + 15 + i * 12, UI.text, 'c'))
      acts.forEach(([label], i) => {
        const col = i === sel ? UI.border : UI.line
        box(g, bx(i), by, BW, BH, col, col)
        text(g, label, bx(i) + BW / 2, by + 11, i === sel ? UI.panel : UI.text, 'c')
      })
    },
  }
}
