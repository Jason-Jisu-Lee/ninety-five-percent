import { save } from '../core/save/save'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { SHOP } from '../data/shop/shop'
import { seen } from '../ui/shop/rules'
import { shop } from '../ui/shop/shop'
import { text, width } from '../ui/text/text'

type Box = number[]
type Look = { name: string; say: string; item: (g: Ctx, b: Box, t: number, name: string) => void; tab: (g: Ctx, x: number, w: number, t: number) => void }

const NEW = ['Feeding Rest', 'Auto Lunge'], TABS = ['Anatomy', 'Appetite'], L = 32, GAP = 26, CW = 184, CH = 17, PX = 196, PY = 20, TOP = 98
const now = () => performance.now() / 1000

Object.assign(save, { started: true, fed: true, told: true, quest: 10, blood: 140, levels: { Lunge: 1, Ambush: 1, 'Auto Target': 1, 'Sharp Mandibles': 3, 'Long Wings': 2, 'Wide Spiracles': 1 } })

const tabs = SHOP.filter(t => t.shop === 'Blood shop').map(t => t.name).filter(n => ['Anatomy', 'Instinct', 'Appetite'].includes(n))
const tabX = (n: string) => tabs.slice(0, tabs.indexOf(n)).reduce((x, c) => x + width(c) + GAP, L)
const instinct = SHOP.find(t => t.name === 'Instinct')!.items.filter(it => it.tier === 1 && seen(0, 'Instinct', 0, it.name)).map(it => it.name)
const cell = (name: string): Box => { const i = instinct.indexOf(name); return [L + (i / 9 | 0) * PX, TOP + (i % 9 + 1) * PY, CW, CH] }

const dot = (g: Ctx, x: number, y: number) => {
  g.fillStyle = UI.panel
  g.fillRect(x - 1, y - 1, 5, 5)
  g.fillStyle = UI.gold
  g.fillRect(x, y, 3, 3)
}
const star = (g: Ctx, x: number, y: number, t: number) => {
  const r = 1 + (t * 2 % 2 | 0)
  g.fillStyle = UI.gold
  g.fillRect(x, y - r, 1, r * 2 + 1)
  g.fillRect(x - r, y, r * 2 + 1, 1)
}

const LOOKS: Look[] = [
  {
    name: 'Word "New"', say: 'A small gold "New" after the name; tabs with something new get a gold dot',
    item: (g, [x, y], _, n) => text(g, 'New', x + 12 + width(n), y + 12, UI.gold),
    tab: (g, x, w) => dot(g, x + w + 2, 58),
  },
  {
    name: 'Corner dot', say: 'A gold dot on the button\'s top right corner, the mobile and console standard; same dot on tabs',
    item: (g, [x, y, w]) => dot(g, x + w - 2, y - 1),
    tab: (g, x, w) => dot(g, x + w + 2, 58),
  },
  {
    name: 'Gold edge', say: 'A gold stripe down the left edge of the button; gold dot on tabs',
    item: (g, [x, y, , h]) => { g.fillStyle = UI.gold; g.fillRect(x, y, 2, h) },
    tab: (g, x, w) => dot(g, x + w + 2, 58),
  },
  {
    name: 'Slow blink', say: 'The button border softly blinks gold; gold dot on tabs',
    item: (g, [x, y, w, h], t) => {
      g.globalAlpha = .35 + .65 * (.5 + .5 * Math.sin(t * 4))
      g.fillStyle = UI.gold
      g.fillRect(x, y, w, 1); g.fillRect(x, y + h - 1, w, 1); g.fillRect(x, y, 1, h); g.fillRect(x + w - 1, y, 1, h)
      g.globalAlpha = 1
    },
    tab: (g, x, w) => dot(g, x + w + 2, 58),
  },
  {
    name: 'Shine', say: 'A white glint runs across the button every 3 seconds, like a new objective; gold dot on tabs',
    item: (g, [x, y, w, h], t) => {
      const u = t % 3 / .6
      if (u >= 1) return
      g.save()
      g.beginPath(); g.rect(x + 1, y + 1, w - 2, h - 2); g.clip()
      g.globalAlpha = .55
      g.fillStyle = '#fff'
      for (let j = 0; j < h; j++) { const sx = Math.round(x - 20 + u * (w + 40) - j * .5); g.fillRect(sx, y + j, 6, 1); g.fillRect(sx + 9, y + j, 2, 1) }
      g.restore()
    },
    tab: (g, x, w) => dot(g, x + w + 2, 58),
  },
  {
    name: 'Twinkle', say: 'A small gold twinkle on the top right corner, like golden prey; same on tabs',
    item: (g, [x, y, w], t) => star(g, x + w - 3, y + 1, t),
    tab: (g, x, w, t) => star(g, x + w + 4, 60, t),
  },
]

const host = document.querySelector('section')!
const figs = LOOKS.map((look, i) => {
  const fig = host.appendChild(document.createElement('figure')), cv = fig.appendChild(mk(W, H)), out = ctx(cv), lair = shop(false), cleared = new Set<string>()
  let mx = -1, my = -1
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${i + 1}</b>${look.name}<i>${look.say}</i></figcaption>`)
  lair.open(0)
  lair.key('ArrowRight')
  cv.onmousemove = e => {
    const r = cv.getBoundingClientRect()
    ;[mx, my] = [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]
  }
  cv.onmouseleave = () => [mx, my] = [-1, -1]
  cv.ondblclick = () => cleared.clear()
  return (t: number) => {
    lair.hover(mx, my)
    lair.draw(out)
    for (const n of NEW) {
      const b = cell(n)
      if (mx >= b[0] && mx < b[0] + b[2] && my >= b[1] && my < b[1] + b[3]) cleared.add(n)
      if (!cleared.has(n)) look.item(out, b, t, n)
    }
    for (const n of TABS) look.tab(out, tabX(n), width(n), t)
  }
})

const tick = () => {
  figs.forEach(f => f(now()))
  requestAnimationFrame(tick)
}
requestAnimationFrame(tick)
