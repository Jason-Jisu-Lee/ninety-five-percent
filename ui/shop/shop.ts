import { buy, level, price, save } from '../../core/save/save'
import { unlock } from '../../core/save/wild'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { PLACES } from '../../data/game/map'
import { H, W } from '../../data/look/screen'
import { UPGRADES } from '../../data/shop/upgrades'
import { SHOP } from '../../data/shop/shop'
import { OPEN } from '../../data/shop/open'
import { WILD } from '../../data/shop/wild'
import { scene, settle } from '../../world/place/place'
import { frame } from '../parts/frame'
import { orb } from '../parts/icons'
import { text, width } from '../text/text'
import { about } from './about'
import { emblem } from './emblem'
import { head } from './head'
import { skill } from './skill'
import { wild } from './wild'

const L = 32, R = W - L, CW = 184, CH = 17, PX = CW + 12, PY = 20, TOP = 98, ROWS = 10, SIDE = L + PX * 2 + 8, GAP = 26, BW = 96, BH = 20, BY = H - 40
const NAMES = ['Blood shop', 'Evolution shop'], SHOPS = NAMES.map(n => SHOP.filter(t => t.shop === n))

export function shop() {
  let shown = false, side = 0, tab = 0, hot = -1, over = -1, go = false, then: (() => void) | undefined
  const born = () => tabs()[tab].name === 'Instinct', feral = () => tabs()[tab].name === 'Wildlife'
  const tabs = () => SHOPS[side], spots = () => tabs().map((_, i) => tabs().slice(0, i).reduce((x, c) => x + width(c.name) + GAP, L)), items = () => feral() ? WILD : tabs()[tab].items.slice(0, ROWS * 2)
  const cell = (i: number) => feral() ? [L + (WILD[i].stage - 1) * PX, TOP + WILD[i].row * PY] : [L + (i / ROWS | 0) * PX, TOP + i % ROWS * PY]
  const closed = (i: number) => !!OPEN[tabs()[tab].name] && !OPEN[tabs()[tab].name].includes(items()[i]?.name)
  const cost = (i: number) => closed(i) ? undefined : feral() ? i < save.wild ? undefined : WILD[i]?.cost : price(items()[i]?.name), can = (i: number) => save.blood >= (cost(i) ?? Infinity) && (!feral() || i === save.wild)
  const inside = (x: number, y: number, bx: number, by: number, w: number, h: number) => x >= bx && x < bx + w && y >= by && y < by + h
  const shut = () => {
    shown = false
    then?.()
  }
  return {
    shown: () => shown,
    open(s: number, done?: () => void) {
      ;[shown, side, tab, hot, then] = [true, s, 0, -1, done]
      PLACES.forEach((_, i) => scene(i + 1))
    },
    hover(x: number, y: number) {
      hot = items().findIndex((_, i) => inside(x, y, cell(i)[0], cell(i)[1], CW, CH))
      over = tabs().findIndex((c, i) => inside(x, y, spots()[i] - 6, 54, width(c.name) + 12, 22))
      go = inside(x, y, R - BW, BY, BW, BH)
      return go || over >= 0 || can(hot)
    },
    click() {
      if (over >= 0) [tab, hot] = [over, -1]
      else if (hot >= 0 && !feral()) can(hot) && buy(items()[hot].name)
      else if (hot >= 0) can(hot) && !unlock()?.kind && settle()
      else if (go) shut()
    },
    key(k: string) {
      const d = k === 'ArrowRight' || k === 'd' ? 1 : k === 'ArrowLeft' || k === 'a' ? -1 : 0
      if (d) [tab, hot] = [(tab + d + tabs().length) % tabs().length, -1]
      else if (k === 'Escape' || k === 'Enter' || k === ' ') shut()
      return true
    },
    draw(g: Ctx) {
      if (!shown) return
      const pick = feral() ? undefined : items()[hot], mark = emblem()
      g.fillStyle = UI.night
      g.fillRect(0, 0, W, H)
      if (born()) skill(g, pick?.name)
      else if (feral()) wild(g, WILD[hot] ?? WILD[save.wild])
      else g.drawImage(mark, SIDE + (R - SIDE - mark.width >> 1), 40)
      head(g, NAMES[side], side, L, R)
      tabs().forEach((c, i) => {
        text(g, c.name, spots()[i], 68, i === tab ? UI.text : i === over ? UI.border : UI.dim)
        g.fillStyle = UI.gold
        if (i === tab) g.fillRect(spots()[i], 72, width(c.name), 1)
      })
      text(g, tabs()[tab].note, L, 88, UI.dim)
      items().forEach((it, i) => {
        const [x, y] = cell(i)
        const c = cost(i), p = String(c), ok = can(i)
        frame(g, x, y, CW, CH, i === hot)
        text(g, it.name, x + 7, y + 12, it.off || (feral() ? i !== save.wild : UPGRADES[it.name] && !c) ? UI.dim : i === hot ? UI.gold : UI.text)
        const n = level(it.name), of = UPGRADES[it.name]?.[2].length ?? 0
        if (!feral() && n && of > 1) text(g, `${n}/${of}`, x + 12 + width(it.name), y + 12, UI.dim)
        if (!c) return
        text(g, p, x + CW - 7, y + 12, ok ? UI.text : UI.dim, 'r')
        orb(g, x + CW - 12 - width(p), y + 8, ok ? '' : UI.dim)
      })
      if (pick) about(g, pick, SIDE, R - SIDE)
      frame(g, R - BW, BY, BW, BH, go)
      text(g, side ? 'Continue' : 'Return', R - BW / 2, BY + 14, go ? UI.gold : UI.text, 'c')
    },
  }
}
