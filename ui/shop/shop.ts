import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { SHOP } from '../../data/shop/shop'
import { gem } from '../parts/icons'
import { text, width } from '../text/text'
import { wrap } from '../text/wrap'
import { emblem } from './emblem'

const L = 32, R = W - L, CW = 184, CH = 17, PX = CW + 12, PY = 20, TOP = 98, ROWS = 10, SIDE = L + PX * 2 + 8, GAP = 26, BW = 96, BH = 20, BY = H - 40

export function shop() {
  let shown = false, tab = 0, hot = -1, over = -1, go = false
  const spots = SHOP.map((_, i) => SHOP.slice(0, i).reduce((x, c) => x + width(c.name) + GAP, L)), items = () => SHOP[tab].items.slice(0, ROWS * 2)
  const cell = (i: number) => [L + (i / ROWS | 0) * PX, TOP + i % ROWS * PY]
  const inside = (x: number, y: number, bx: number, by: number, w: number, h: number) => x >= bx && x < bx + w && y >= by && y < by + h
  const frame = (g: Ctx, x: number, y: number, w: number, h: number, lit: boolean) => {
    g.fillStyle = lit ? UI.gold : UI.line
    g.fillRect(x, y, w, h)
    g.fillStyle = UI.night
    g.fillRect(x + 1, y + 1, w - 2, h - 2)
  }
  return {
    shown: () => shown,
    open() {
      ;[shown, tab, hot] = [true, 0, -1]
    },
    hover(x: number, y: number) {
      hot = items().findIndex((_, i) => inside(x, y, cell(i)[0], cell(i)[1], CW, CH))
      over = SHOP.findIndex((c, i) => inside(x, y, spots[i] - 6, 54, width(c.name) + 12, 22))
      go = inside(x, y, R - BW, BY, BW, BH)
      return go || over >= 0
    },
    click() {
      if (over >= 0) [tab, hot] = [over, -1]
      else if (go) shown = false
    },
    key(k: string) {
      const d = k === 'ArrowRight' || k === 'd' ? 1 : k === 'ArrowLeft' || k === 'a' ? -1 : 0
      if (d) [tab, hot] = [(tab + d + SHOP.length) % SHOP.length, -1]
      else if (k === 'Escape' || k === 'Enter' || k === ' ') shown = false
      return true
    },
    draw(g: Ctx) {
      if (!shown) return
      const pick = items()[hot], mark = emblem(), n = String(save.points)
      g.fillStyle = UI.night
      g.fillRect(0, 0, W, H)
      g.drawImage(mark, SIDE + (R - SIDE - mark.width >> 1), 40)
      text(g, 'Evolution', L, 38, UI.text, undefined, undefined, 2)
      text(g, n, R, 38, UI.gold, 'r', undefined, 2)
      gem(g, R - width(n) * 2 - 9, 31, UI.gold)
      g.fillStyle = UI.line
      g.fillRect(L, 48, R - L, 1)
      g.fillRect(L, H - 52, R - L, 1)
      SHOP.forEach((c, i) => {
        text(g, c.name, spots[i], 68, i === tab ? UI.text : i === over ? UI.border : UI.dim)
        g.fillStyle = UI.gold
        if (i === tab) g.fillRect(spots[i], 72, width(c.name), 1)
      })
      text(g, SHOP[tab].note, L, 88, UI.dim)
      items().forEach((it, i) => {
        const [x, y] = cell(i), lit = i === hot
        frame(g, x, y, CW, CH, lit)
        text(g, it.name, x + 7, y + 12, lit ? UI.gold : UI.text)
        text(g, String(it.cost), x + CW - 7, y + 12, UI.gold, 'r')
        gem(g, x + CW - width(String(it.cost)) - 13, y + 8, UI.gold)
      })
      if (pick) {
        const say = wrap(pick.text[0].toUpperCase() + pick.text.slice(1), R - SIDE)
        text(g, pick.name, SIDE, 238, UI.gold)
        say.forEach((line, i) => text(g, line, SIDE, 254 + i * 11, UI.text))
        gem(g, SIDE + 2, 259 + say.length * 11, UI.gold)
        text(g, String(pick.cost), SIDE + 10, 263 + say.length * 11, UI.gold)
      }
      frame(g, R - BW, BY, BW, BH, go)
      text(g, 'Continue', R - BW / 2, BY + 14, go ? UI.gold : UI.text, 'c')
    },
  }
}
