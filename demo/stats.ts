import { buy, save } from '../core/save/save'
import { FIGHT } from '../data/dragonfly/fight'
import { FLY, STAMINA } from '../data/dragonfly/flight'
import { BASE, STAT, type Stat } from '../data/dragonfly/stats'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { ANATOMY } from '../data/shop/anatomy'
import { SHOP } from '../data/shop/shop'
import { shop } from '../ui/shop/shop'
import { text } from '../ui/text/text'

const X = 432, R = 608, MID = 548, num = (v: number) => String(Math.round(v * 10) / 10), pct = (v: number) => Math.round(v * 100) + '%'
const ROWS: [label: string, stat: Stat, base: (v: number) => string, now: (v: number) => string][] = [
  ['Power', 'power', num, num],
  ['Health', 'health', num, num],
  ['Damage taken', 'armour', v => pct(1 - v), v => pct(1 - v)],
  ['Top speed', 'speed', v => String(Math.round(FLY.top * v / 3.8)), v => Math.round(FLY.top * v / 3.8) + ' cm/s'],
  ['Turning', 'turn', v => String(Math.round(75 * v)), v => Math.round(75 * v) + ' deg/s'],
  ['Acceleration', 'accel', v => num(Math.log(10) / (FLY.accel * v)), v => num(Math.log(10) / (FLY.accel * v)) + ' s'],
  ['Stamina', 'stamina', v => String(Math.round(100 / STAMINA.sprint * v)), v => Math.round(100 / STAMINA.sprint * v) + ' s'],
  ['Catch reach', 'reach', v => num(FLY.catch * v), v => num(FLY.catch * v)],
  ['Rest, stamina', 'rest', v => num(STAMINA.regen * v) + '%', v => num(STAMINA.regen * v) + '%'],
  ['Rest, health', 'rest', v => num(FIGHT.heal * 100 * v) + '%', v => num(FIGHT.heal * 100 * v) + '%'],
  ['Mend in flight', 'mend', v => v ? '1%' : 'none', v => v ? '1%' : 'none'],
]
const ITEMS = SHOP.find(t => t.shop === 'Blood shop' && t.name === 'Anatomy')!.items
const OPTIONS: [title: string, show: (hot: string) => boolean, lit: boolean][] = [
  ['1. Table always shown, in place of the dragonfly', () => true, false],
  ['2. Table always shown; hovering an upgrade lights its row and shows the next level in gold', () => true, true],
  ['3. Dragonfly as now; hovering an Anatomy upgrade swaps it for the table, row lit, next level in gold', hot => !!hot, true],
]

function table(g: CanvasRenderingContext2D, hot: string, lit: boolean) {
  const [stat, each, cost] = ANATOMY[hot] ?? [], next = lit && level(hot) < (cost?.length ?? 0)
  g.fillStyle = UI.night
  g.fillRect(X, 50, R - X, 182)
  text(g, 'Base', MID, 110, UI.dim, 'r')
  text(g, 'Now', R, 110, UI.dim, 'r')
  ROWS.forEach(([label, s, base, now], i) => {
    const y = 122 + i * 10, on = lit && s === stat, v = STAT[s] + (on && next ? each! : 0)
    text(g, label, X, y, on ? UI.gold : UI.text)
    text(g, base(BASE[s]), MID, y, UI.dim, 'r')
    text(g, now(v), R, y, on && next ? UI.gold : UI.text, 'r')
  })
}
const level = (name: string) => save.levels[name] ?? 0

save.blood = 5000
const grid = document.querySelector('main')!
for (const [title, show, lit] of OPTIONS) {
  const box = grid.appendChild(document.createElement('section')), cv = document.createElement('canvas'), g = cv.getContext('2d')!, s = shop()
  box.appendChild(document.createElement('h2')).textContent = title
  box.appendChild(cv)
  Object.assign(cv, { width: W, height: H })
  s.open(0)
  let hot = ''
  cv.onpointermove = e => {
    const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height
    const i = ITEMS.slice(0, 20).findIndex((_, i) => x >= 32 + (i / 10 | 0) * 196 && x < 216 + (i / 10 | 0) * 196 && y >= 98 + i % 10 * 20 && y < 115 + i % 10 * 20)
    hot = ITEMS[i]?.name ?? ''
    cv.style.cursor = s.hover(x, y) && hot ? 'pointer' : ''
  }
  cv.onpointerleave = () => {
    hot = ''
    s.hover(-1, -1)
  }
  cv.onpointerdown = () => hot && buy(hot)
  const frame = () => {
    requestAnimationFrame(frame)
    s.draw(g)
    if (show(hot)) table(g, hot, lit)
  }
  frame()
}
