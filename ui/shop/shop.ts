import { sound } from '../../audio/player/sound'
import { buy, level, price, progress, save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { FOREST, UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { FIRST, FREE, LESSON } from '../../data/shop/open'
import { brackets } from '../parts/brackets'
import { frame } from '../parts/frame'
import { icon } from '../parts/icons'
import { text, width } from '../text/text'
import { about } from './about'
import { emblem } from './emblem'
import { head } from './head'
import { CH, CW, row } from './row'
import { early as fresh, listed, seen, sold, veiled as hid } from './rules'
import { skill } from './skill'
import { stats } from './stats'

const L = 32, R = W - L, PX = CW + 12, PY = 20, TOP = 98, ROWS = 10, SIDE = L + PX * 2 + 8, GAP = 26, BW = 96, BH = 20, BY = H - 40
const DEV = import.meta.env.DEV, SECRET = 'Pink: hidden from players', TITLES = ['Lair', 'Evolution']
const TIER = (i: number) => 'Tier ' + (i + 1), STEP = width(TIER(0)) + GAP, PIN = 14

export function shop(peek = DEV) {
  let shown = false, side = 0, tab = 0, tier = 0, hot = -1, over = -1, rung = -1, go = false, led = false, freed = -9, miss = -9, then: (() => void) | undefined
  const table = stats(432, 110, true), body = () => tabs()[tab].name === 'Anatomy', born = () => tabs()[tab].name === 'Instinct'
  const early = () => fresh(side), veiled = (name: string) => hid(side, name), tabs = () => listed(side, peek), known = (name = '') => seen(side, tabs()[tab].name, tier, name)
  const tiers = () => Math.max(...tabs()[tab].items.map(it => it.tier)), split = () => tiers() > 0 && (peek || !early())
  const all = () => tabs()[tab].items.filter(it => !it.tier || it.tier === tier + 1).slice(0, ROWS * 2), spots = () => tabs().map((_, i) => tabs().slice(0, i).reduce((x, c) => x + width(c.name) + GAP, L))
  const items = () => [...all().filter(it => known(it.name)), ...all().filter(it => peek && !known(it.name))]
  const cell = (i: number, d = +(tiers() > 0)) => [L + (i / (ROWS - d) | 0) * PX, TOP + (i % (ROWS - d) + d) * PY]
  const closed = (i: number) => !known(items()[i]?.name) || !sold(tabs()[tab].name, items()[i]?.name)
  const cost = (i: number) => closed(i) ? undefined : price(items()[i]?.name), can = (i: number) => save.blood >= (cost(i) ?? Infinity)
  const inside = (x: number, y: number, bx: number, by: number, w: number, h: number) => x >= bx && x < bx + w && y >= by && y < by + h
  const clock = () => performance.now() / 1000, slot = (i: number) => [spots()[i] - 6, 54, width(tabs()[i].name) + 12, 22]
  const must = () => {
    if (early()) for (const [where, name] of LESSON) if (!level(name) && save.blood >= (price(name) ?? Infinity))
      return tabs()[tab].name === where ? [...cell(items().findIndex(it => it.name === name)), CW, CH] : slot(tabs().findIndex(t => t.name === where))
  }
  const spent = () => early() && !Object.values(FIRST).flat().some(name => save.blood >= (price(name) ?? Infinity))
  const shut = () => {
    shown = false
    then?.()
  }
  return {
    shown: () => shown,
    open(s: number, done?: () => void) {
      ;[shown, side, tab, tier, hot, led, freed, miss, then] = [true, s, 0, 0, -1, false, -9, -9, done]
    },
    hover(x: number, y: number) {
      const was = hot, m = must()
      if (m && !inside(x, y, m[0], m[1], m[2], m[3])) x = y = -1
      hot = items().findIndex((_, i) => inside(x, y, cell(i)[0], cell(i)[1], CW, CH))
      if (hot >= 0 && hot !== was) sound('tap')
      const [tabbed, stepped, gone] = [over, rung, go]
      over = tabs().findIndex((_, i) => inside(x, y, slot(i)[0], 54, slot(i)[2], 22))
      rung = split() && inside(x, y, L - 6, TOP, (peek ? tiers() : FREE) * STEP, CH) && (x - L + 6) % STEP < STEP - GAP + 12 ? (x - L + 6) / STEP | 0 : -1
      go = inside(x, y, R - BW, BY, BW, BH)
      if (over >= 0 && over !== tabbed || rung >= 0 && rung !== stepped || go && !gone) sound('hover')
      table.hover(body() ? x : -1, y)
      return go || over >= 0 || rung >= 0 || can(hot)
    },
    click() {
      if (over >= 0) [tab, tier, hot] = [over, 0, -1]
      else if (rung >= 0) [tier, hot] = [rung, -1]
      else if (hot >= 0) can(hot) && (buy(items()[hot].name), sound('buy'), body() && progress('anatomy', true))
      else if (go) shut()
      else if (must()) miss = clock()
    },
    key(k: string) {
      if (must()) return true
      const d = k === 'ArrowRight' || k === 'd' ? 1 : k === 'ArrowLeft' || k === 'a' ? -1 : 0
      if (d) [tab, tier, hot] = [(tab + d + tabs().length) % tabs().length, 0, -1]
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
      if (split()) for (let i = 0; i < tiers(); i++) {
        const shut = i >= FREE, x = L + i * STEP
        text(g, TIER(i), x, TOP + 12, early() || shut && peek ? FOREST.pink : shut ? UI.faint : i === tier ? UI.text : i === rung ? UI.border : UI.dim)
        g.fillStyle = UI.gold
        if (i === tier) g.fillRect(x, TOP + 16, width(TIER(i)), 1)
        if (shut && !early()) icon(g, 'lock', x + width(TIER(i)) + 4, TOP + 5, UI.faint)
      }
      if (early()) for (let i = FREE; i < tiers(); i++) icon(g, 'lock', L + (i - FREE) * PIN + +split() * tiers() * STEP, TOP + 5, UI.faint)
      items().forEach((it, i) => row(g, it, ...cell(i) as [number, number], i === hot, known(it.name), cost(i), can(i)))
      if (pick) about(g, pick, SIDE, R - SIDE)
      if (body()) table.tip(g)
      if (tabs().some(t => veiled(t.name))) text(g, SECRET, L, BY + 14, FOREST.pink)
      const m = must(), t = clock(), near = 2 + Math.round(7 * (1 - Math.min(1, t % 1.2 / .4)) ** 2), back = [R - BW, BY, BW, BH]
      if (m) brackets(g, m, near, t - miss < .24 ? Math.round(Math.sin((t - miss) / .24 * Math.PI * 6) * 2) : 0)
      else if (led) freed = t
      led = !!m
      if (spent()) brackets(g, back, near)
      else if (t - freed < .9 && (t - freed) % .3 < .18) for (const r of [slot(tabs().findIndex((c, i) => i !== tab && !veiled(c.name))), back]) brackets(g, r, 2)
      frame(g, R - BW, BY, BW, BH, go)
      text(g, side ? 'Continue' : 'Return', R - BW / 2, BY + 14, go ? UI.gold : UI.text, 'c')
    },
  }
}
