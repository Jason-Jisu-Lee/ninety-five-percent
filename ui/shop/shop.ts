import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { FOREST as C, UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { SHOP } from '../../data/shop/shop'
import { drop, gem } from '../parts/icons'
import { text, width } from '../text/text'
import { wrap } from '../text/wrap'
import { emblem } from './emblem'

const L = 32, R = W - L, CW = 184, CH = 17, PX = CW + 12, PY = 20, TOP = 98, ROWS = 10, SIDE = L + PX * 2 + 8, GAP = 26, BW = 96, BH = 20, BY = H - 40
const NAMES = ['Blood', 'Evolution'], SHOPS = NAMES.map(n => SHOP.filter(t => t.shop === n + ' shop'))
const heads = NAMES.map((_, i) => NAMES.slice(0, i).reduce((x, n) => x + width(n) * 2 + GAP, L))

export function shop() {
  let shown = false, side = 0, tab = 0, hot = -1, over = -1, head = -1, go = false
  const tabs = () => SHOPS[side], spots = () => tabs().map((_, i) => tabs().slice(0, i).reduce((x, c) => x + width(c.name) + GAP, L)), items = () => tabs()[tab].items.slice(0, ROWS * 2)
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
    open(s = 1) {
      ;[shown, side, tab, hot] = [true, s, 0, -1]
    },
    hover(x: number, y: number) {
      hot = items().findIndex((_, i) => inside(x, y, cell(i)[0], cell(i)[1], CW, CH))
      over = tabs().findIndex((c, i) => inside(x, y, spots()[i] - 6, 54, width(c.name) + 12, 22))
      head = NAMES.findIndex((n, i) => i !== side && inside(x, y, heads[i] - 6, 22, width(n) * 2 + 12, 22))
      go = inside(x, y, R - BW, BY, BW, BH)
      return go || over >= 0 || head >= 0
    },
    click() {
      if (head >= 0) [side, tab, hot, head] = [head, 0, -1, -1]
      else if (over >= 0) [tab, hot] = [over, -1]
      else if (go) shown = false
    },
    key(k: string) {
      const d = k === 'ArrowRight' || k === 'd' ? 1 : k === 'ArrowLeft' || k === 'a' ? -1 : 0
      if (d) [tab, hot] = [(tab + d + tabs().length) % tabs().length, -1]
      else if (k === 'Escape' || k === 'Enter' || k === ' ') shown = false
      return true
    },
    draw(g: Ctx) {
      if (!shown) return
      const pick = items()[hot], mark = emblem(), n = String(Math.floor(side ? save.points : save.blood))
      g.fillStyle = UI.night
      g.fillRect(0, 0, W, H)
      g.drawImage(mark, SIDE + (R - SIDE - mark.width >> 1), 40)
      NAMES.forEach((name, i) => text(g, name, heads[i], 38, i === side ? UI.text : i === head ? UI.border : UI.dim, undefined, undefined, 2))
      text(g, n, R, 38, side ? UI.gold : UI.text, 'r', undefined, 2)
      if (side) gem(g, R - width(n) * 2 - 9, 31, UI.gold)
      else drop(g, R - width(n) * 2 - 8, 31, C.red)
      g.fillStyle = UI.line
      g.fillRect(L, 48, R - L, 1)
      g.fillRect(L, H - 52, R - L, 1)
      tabs().forEach((c, i) => {
        text(g, c.name, spots()[i], 68, i === tab ? UI.text : i === over ? UI.border : UI.dim)
        g.fillStyle = UI.gold
        if (i === tab) g.fillRect(spots()[i], 72, width(c.name), 1)
      })
      text(g, tabs()[tab].note, L, 88, UI.dim)
      items().forEach((it, i) => {
        const [x, y] = cell(i)
        frame(g, x, y, CW, CH, i === hot)
        text(g, it.name, x + 7, y + 12, i === hot ? UI.gold : UI.text)
      })
      if (pick) {
        text(g, pick.name, SIDE, 238, UI.gold)
        wrap(pick.text[0].toUpperCase() + pick.text.slice(1), R - SIDE).forEach((line, i) => text(g, line, SIDE, 254 + i * 11, UI.text))
      }
      frame(g, R - BW, BY, BW, BH, go)
      text(g, 'Continue', R - BW / 2, BY + 14, go ? UI.gold : UI.text, 'c')
    },
  }
}
