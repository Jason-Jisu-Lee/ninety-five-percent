import { sound } from '../../audio/player/sound'
import { buy, level, price, save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { FOREST, UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { UPGRADES } from '../../data/shop/upgrades'
import { SHOP } from '../../data/shop/shop'
import { FIRST, HIDDEN, OPEN } from '../../data/shop/open'
import { frame } from '../parts/frame'
import { icon, orb } from '../parts/icons'
import { text, width } from '../text/text'
import { about } from './about'
import { emblem } from './emblem'
import { head } from './head'
import { skill } from './skill'
import { stats } from './stats'

const L = 32, R = W - L, CW = 184, CH = 17, PX = CW + 12, PY = 20, TOP = 98, ROWS = 10, SIDE = L + PX * 2 + 8, GAP = 26, BW = 96, BH = 20, BY = H - 40
const DEV = import.meta.env.DEV, SECRET = 'Pink: hidden from players', NAMES = ['Blood shop', 'Evolution shop'], TITLES = ['Lair', 'Evolution'], SHOPS = NAMES.map(n => SHOP.filter(t => t.shop === n))

export function shop(peek = DEV) {
  let shown = false, side = 0, tab = 0, hot = -1, over = -1, go = false, then: (() => void) | undefined
  const table = stats(432, 110, true), body = () => tabs()[tab].name === 'Anatomy', born = () => tabs()[tab].name === 'Instinct'
  const early = () => !side && !save.fed, veiled = (name: string) => HIDDEN.includes(name) || early() && !FIRST[name]
  const tabs = () => [...SHOPS[side].filter(t => !veiled(t.name)), ...SHOPS[side].filter(t => peek && veiled(t.name))]
  const known = (name = '') => !veiled(tabs()[tab].name) && (!early() || !!FIRST[tabs()[tab].name]?.includes(name))
  const all = () => tabs()[tab].items.slice(0, ROWS * 2), spots = () => tabs().map((_, i) => tabs().slice(0, i).reduce((x, c) => x + width(c.name) + GAP, L))
  const items = () => [...all().filter(it => known(it.name)), ...all().filter(it => peek && !known(it.name))]
  const cell = (i: number) => [L + (i / ROWS | 0) * PX, TOP + i % ROWS * PY]
  const closed = (i: number) => !known(items()[i]?.name) || !!OPEN[tabs()[tab].name] && !OPEN[tabs()[tab].name].includes(items()[i]?.name)
  const cost = (i: number) => closed(i) ? undefined : price(items()[i]?.name), can = (i: number) => save.blood >= (cost(i) ?? Infinity)
  const inside = (x: number, y: number, bx: number, by: number, w: number, h: number) => x >= bx && x < bx + w && y >= by && y < by + h
  const shut = () => {
    shown = false
    then?.()
  }
  return {
    shown: () => shown,
    open(s: number, done?: () => void) {
      ;[shown, side, tab, hot, then] = [true, s, 0, -1, done]
    },
    hover(x: number, y: number) {
      const was = hot
      hot = items().findIndex((_, i) => inside(x, y, cell(i)[0], cell(i)[1], CW, CH))
      if (hot >= 0 && hot !== was) sound('tap')
      const [tabbed, gone] = [over, go]
      over = tabs().findIndex((c, i) => inside(x, y, spots()[i] - 6, 54, width(c.name) + 12, 22))
      go = inside(x, y, R - BW, BY, BW, BH)
      if (over >= 0 && over !== tabbed || go && !gone) sound('hover')
      table.hover(body() ? x : -1, y)
      return go || over >= 0 || can(hot)
    },
    click() {
      if (over >= 0) [tab, hot] = [over, -1]
      else if (hot >= 0) can(hot) && buy(items()[hot].name)
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
      const pick = items()[hot], mark = emblem()
      g.fillStyle = UI.night
      g.fillRect(0, 0, W, H)
      if (born()) skill(g, pick?.name)
      else if (body()) table.draw(g, pick?.name)
      else g.drawImage(mark, SIDE + (R - SIDE - mark.width >> 1), 40)
      head(g, TITLES[side], side, L, R)
      tabs().forEach((c, i) => {
        text(g, c.name, spots()[i], 68, veiled(c.name) ? FOREST.pink : i === tab ? UI.text : i === over ? UI.border : UI.dim)
        g.fillStyle = UI.gold
        if (i === tab) g.fillRect(spots()[i], 72, width(c.name), 1)
      })
      if (!side) icon(g, 'lock', spots()[tabs().length - 1] + width(tabs()[tabs().length - 1].name) + GAP, 61, UI.faint)
      text(g, tabs()[tab].note, L, 88, UI.dim)
      items().forEach((it, i) => {
        const [x, y] = cell(i)
        const c = cost(i), p = String(c), ok = can(i)
        frame(g, x, y, CW, CH, i === hot)
        g.fillStyle = FOREST.pink
        if (!known(it.name)) g.fillRect(x, y, 2, CH)
        text(g, it.name, x + 7, y + 12, !known(it.name) ? FOREST.pink : it.off || UPGRADES[it.name] && !c ? UI.dim : i === hot ? UI.gold : UI.text)
        const n = level(it.name), of = UPGRADES[it.name]?.[2].length ?? 0
        if (n && of > 1) text(g, `${n}/${of}`, x + 12 + width(it.name), y + 12, UI.dim)
        if (!c) return
        text(g, p, x + CW - 7, y + 12, ok ? UI.text : UI.dim, 'r')
        orb(g, x + CW - 12 - width(p), y + 8, ok ? '' : UI.dim)
      })
      if (pick) about(g, pick, SIDE, R - SIDE)
      if (body()) table.tip(g)
      if (tabs().some(t => veiled(t.name))) text(g, SECRET, L, BY + 14, FOREST.pink)
      frame(g, R - BW, BY, BW, BH, go)
      text(g, side ? 'Continue' : 'Return', R - BW / 2, BY + 14, go ? UI.gold : UI.text, 'c')
    },
  }
}
