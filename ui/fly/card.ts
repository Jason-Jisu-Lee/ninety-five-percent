import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { icon } from '../parts/icons'
import { box, panel } from '../parts/panel'
import { stats, TALL } from '../shop/stats'
import { text } from '../text/text'

const PW = 200, PH = TALL + 32, X = W - PW >> 1, Y = H - PH >> 1, SEE = .84, sheet = ctx(mk(PW, PH))

export function flyCard() {
  let shown = false, hot = false
  const table = stats(X + 12, Y + 26, true), onX = (x: number, y: number) => x >= X + PW - 19 && x < X + PW - 8 && y >= Y + 6 && y < Y + 17
  return {
    shown: () => shown,
    open() {
      shown = true
    },
    hover(x: number, y: number) {
      table.hover(x, y)
      return hot = onX(x, y)
    },
    click(x: number, y: number) {
      if (onX(x, y) || x < X || x >= X + PW || y < Y || y >= Y + PH) shown = false
    },
    key(k: string) {
      if (k === 'Escape' || k === 'Enter' || k === ' ') shown = false
      return true
    },
    draw(g: Ctx) {
      if (!shown) return
      sheet.clearRect(0, 0, PW, PH)
      panel(sheet, 0, 0, PW, PH, UI.border, UI.panel)
      g.globalAlpha = SEE
      g.drawImage(sheet.canvas, X, Y)
      g.globalAlpha = 1
      box(g, X + PW - 19, Y + 6, 11, 11, hot ? UI.accent : UI.border, UI.panel)
      icon(g, 'x', X + PW - 16, Y + 9, UI.text)
      text(g, 'Dragonfly', X + 12, Y + 21, UI.text, undefined, undefined, 2)
      table.draw(g)
      table.tip(g)
    },
  }
}
