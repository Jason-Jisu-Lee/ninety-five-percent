import './seed'
import { clamp } from '../core/math/clamp'
import { offered } from '../core/save/mutate'
import { save } from '../core/save/save'
import { pack } from '../core/save/wild'
import type { Ctx } from '../core/screen/canvas'
import type { Kind } from '../data/enemies/enemies'
import { MUTATE as M } from '../data/game/mutations'
import { ORB, UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { WILD, type Wild } from '../data/shop/wild'
import { foe } from '../ui/enemy/card'
import { details, DW } from '../ui/parts/details'
import { disc } from '../ui/parts/disc'
import { orb } from '../ui/parts/icons'
import { note } from '../ui/parts/note'
import { panel, soft } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { figure } from './base'

type Hit = [x: number, y: number, w: number, h: number]
type Hot = [what: 'foe' | 'gene', hit: Hit] | undefined
const STEPS = [[0, 6], [0, 15], [2, 60], [2, 230]], HIDE = '?????', R = W - 8, B = H - 8
const HOME: Partial<Record<Kind, number[]>> = { moth: [50, 106], mayfly: [300, 150], ladybird: [411, 112], bumblebee: [585, 98], wasp: [320, 200] }, DEN = [470, 270], BEAD = ['.###.', '#o###', '#####', '###d#', '.###.']
let step = 0, open = false
const now = () => WILD[pack.got], next = () => WILD[pack.got + 1], can = (n: number) => save.blood >= n
const label = (w: Wild) => w.kind ? w.name : 'Expansion: ' + w.name
const inside = (mx: number, my: number, [x, y, w, h]: Hit) => mx >= x && mx < x + w && my >= y && my < y + h
const pay = (g: Ctx, n: number, r: number, y: number, col: string, edge?: string) => {
  const p = String(n)
  text(g, p, r, y, col, 'r', edge)
  orb(g, r - width(p) - 5, y - 4, col === UI.text ? '' : col, edge)
}
const mid = (g: Ctx, n: number, cx: number, y: number, col: string, edge?: string) => pay(g, n, cx + (width(String(n)) + 8 >> 1), y, col, edge)
const lit = (ok: boolean, on: boolean) => ok ? on ? UI.text : UI.gold : UI.line

function tag(g: Ctx, mx: number, my: number, name: string, cost: number, cx: number, y: number, live = true): Hit | undefined {
  const w = width(name) + width(String(cost)) + 26, x = clamp(Math.round(cx - w / 2), 4, W - 4 - w), ok = live && can(cost), on = live && inside(mx, my, [x, y, w, 15])
  soft(g, x, y, w, 15, lit(ok, on))
  text(g, name, x + 6, y + 11, !live ? UI.dim : ok ? UI.gold : UI.text)
  pay(g, cost, x + w - 6, y + 11, ok ? UI.text : UI.dim)
  return on ? [x, y, w, 15] : undefined
}

const WAYS: [string, string, (g: Ctx, mx: number, my: number) => Hot][] = [
  ['Price badges', 'Round badges like the Return to Lair one, bottom right: the price inside, the name under it. Gold ring when you can pay', (g, mx, my) => {
    let hot: Hot
    const badge = (name: string, cost: number, n: number, what?: 'foe' | 'gene') => {
      const cx = R - 26 - n * 58, cy = B - 28, hit: Hit = [cx - 16, cy - 16, 33, 44], ok = !!what && can(cost), on = !!what && inside(mx, my, hit)
      disc(g, cx, cy, 16, lit(ok, on))
      orb(g, cx, cy - 6, ok ? '' : UI.dim)
      text(g, String(cost), cx, cy + 9, ok ? UI.text : UI.dim, 'c')
      text(g, name, cx, B - 1, !what ? UI.dim : ok ? UI.gold : UI.text, 'c', UI.panel)
      if (on) hot = [what!, hit]
    }
    badge(HIDE, next().cost, 0)
    badge(label(now()), now().cost, 1, 'foe')
    if (offered()) badge(M.name, M.cost, 2, 'gene')
    return hot
  }],
  ['One badge that opens', 'A single lifeblood badge, bottom right. Point at it and the list opens above it, the way the sound box opens from the music icon. A gold ring and a number say how many things you can pay for', (g, mx, my) => {
    const rows: [string, number, ('foe' | 'gene')?][] = [...(offered() ? [[M.name, M.cost, 'gene'] as [string, number, 'gene']] : []), [label(now()), now().cost, 'foe'], [HIDE, next().cost]]
    const cx = R - 16, cy = B - 16, w = 132, x = R - w, tall = rows.length * 16 + 4, top = cy - 20 - tall, ready = rows.filter(r => r[2] && can(r[1])).length
    let hot: Hot
    open = inside(mx, my, [cx - 17, cy - 17, 35, 35]) || open && inside(mx, my, [x - 2, top - 2, w + 4, tall + 6])
    disc(g, cx, cy, 16, open ? UI.text : ready ? UI.gold : UI.line)
    BEAD.forEach((row, j) => [...row].forEach((ch, i) => {
      g.fillStyle = ORB[ch]
      if (ch !== '.') g.fillRect(cx - 7 + i * 3, cy - 7 + j * 3, 3, 3)
    }))
    if (ready) disc(g, cx + 12, cy - 12, 5, UI.gold), text(g, String(ready), cx + 12, cy - 8, UI.gold, 'c')
    if (!open) return
    soft(g, x, top, w, tall, UI.line)
    rows.forEach(([name, cost, what], i) => {
      const y = top + 2 + i * 16, ok = !!what && can(cost), on = !!what && inside(mx, my, [x, y, w, 16])
      g.fillStyle = UI.line
      if (on) g.fillRect(x + 3, y, w - 6, 15)
      text(g, name, x + 7, y + 12, !what ? UI.dim : on || ok ? UI.gold : UI.text)
      pay(g, cost, R - 7, y + 12, ok ? UI.text : UI.dim)
      if (on) hot = [what!, [x, top, w, tall]]
    })
    return hot
  }],
  ['Cards', 'Cards held at the bottom edge like a hand: the next enemy face up, the one after it face down. The card under the pointer lifts. Gold edge when you can pay', (g, mx, my) => {
    let hot: Hot
    const card = (name: string, cost: number, n: number, what?: 'foe' | 'gene') => {
      const w = 62, x = R - w - n * (w + 4), ok = !!what && can(cost), on = !!what && inside(mx, my, [x, H - 34, w, 34]), y = H - (on ? 38 : 28)
      panel(g, x, y, w, 60, lit(ok, on), UI.night)
      if (what) text(g, name, x + w / 2, y + 12, ok ? UI.gold : UI.text, 'c')
      else for (let i = 4; i < w - 4; i += 4) for (let j = 4; j < 14; j += 4) g.fillStyle = UI.line, g.fillRect(x + i + (j & 4 ? 2 : 0), y + j, 2, 2)
      mid(g, cost, x + w / 2, y + 24, ok ? UI.text : UI.dim)
      if (on) hot = [what!, [x, y, w, 38]]
    }
    card(HIDE, next().cost, 0)
    card(label(now()), now().cost, 1, 'foe')
    if (offered()) card(M.name, M.cost, 2, 'gene')
    return hot
  }],
  ['Road ahead', 'The whole ladder of this place as a row of dots, bottom right: gold ones are bought, the big one is next and carries its name and price, the diamond is the next place. Mutations hangs off the Mayfly as a side branch', (g, mx, my) => {
    const stage = now().stage, row = WILD.filter(v => v.stage === stage || v.stage === stage + 1 && !v.kind), y = B - 22, at = (i: number) => R - 8 - (row.length - 1 - i) * 22
    let hot: Hot
    row.forEach((v, i) => {
      const n = WILD.indexOf(v), x = at(i), r = n === pack.got ? 3 : 2, col = n < pack.got ? UI.gold : n === pack.got ? can(v.cost) ? UI.gold : UI.text : UI.dim
      for (const [ink, o] of [[UI.panel, 1], [n <= pack.got ? UI.gold : UI.dim, 0]] as const) if (i) g.fillStyle = ink, g.fillRect(at(i - 1) + 4 - o, y - o, 14 + o * 2, 1 + o * 2)
      for (const [ink, o] of [[UI.panel, 1], [col, 0]] as const) {
        g.fillStyle = ink
        if (v.kind) g.fillRect(x - r - o, y - r - o, r * 2 + 1 + o * 2, r * 2 + 1 + o * 2)
        else for (let j = -r - o; j <= r + o; j++) g.fillRect(x - (r + o - Math.abs(j)), y + j, (r + o - Math.abs(j)) * 2 + 1, 1)
      }
      if (n === pack.got + 1) mid(g, v.cost, x, y + 15, UI.dim, UI.panel)
    })
    const here = row.indexOf(now()), hit = tag(g, mx, my, label(now()), now().cost, at(here), y - 24)
    g.fillStyle = UI.panel
    g.fillRect(at(here) - 1, y - 9, 3, 5)
    g.fillStyle = can(now().cost) ? UI.gold : UI.text
    g.fillRect(at(here), y - 9, 1, 5)
    if (hit) hot = ['foe', hit]
    if (!offered()) return hot
    const bx = at(1), side = tag(g, mx, my, M.name, M.cost, bx - 62, y + 7)
    for (const [ink, o] of [[UI.panel, 1], [UI.gold, 0]] as const) g.fillStyle = ink, g.fillRect(bx - o, y + 3 - o, 1 + o * 2, 12 + o * 2), g.fillRect(bx - 14 - o, y + 14 - o, 15 + o * 2, 1 + o * 2)
    return side ? ['gene', side] : hot
  }],
  ['Tags on the map', 'No shop corner at all. Each thing to buy is a tag on the map where it lives: the Moth at the flowers, the Ladybird on the lily pads, Mutations by the old log. The next one after shows as a dim tag where it will live', (g, mx, my) => {
    let hot: Hot
    const pin = (name: string, cost: number, [x, y]: number[], what?: 'foe' | 'gene') => {
      const hit = tag(g, mx, my, name, cost, x, y - 24, !!what)
      for (const [ink, o] of [[UI.panel, 1], [!what ? UI.dim : can(cost) ? UI.gold : UI.text, 0]] as const) g.fillStyle = ink, g.fillRect(x - o, y - 9 - o, 1 + o * 2, 6 + o * 2), g.fillRect(x - 1 - o, y - 3 - o, 3 + o * 2, 3 + o * 2)
      if (hit) hot = [what!, hit]
    }
    pin(HIDE, next().cost, HOME[next().kind!] ?? [W / 2, 60])
    pin(label(now()), now().cost, HOME[now().kind!] ?? [W / 2, 60], 'foe')
    if (offered()) pin(M.name, M.cost, DEN, 'gene')
    return hot
  }],
]

const host = document.querySelector('section')!, click = () => {
  step = (step + 1) % STEPS.length
  ;[pack.got, save.blood] = STEPS[step]
}
;[pack.got, save.blood] = STEPS[0]
WAYS.forEach(([name, say, draw], i) => figure(host, i + 1, name, say, (g, mx, my) => {
  const hot = draw(g, mx, my), kind = now().kind
  if (!hot) return
  const [x, y, w, h] = hot[1], up = y > H / 2
  if (hot[0] === 'foe') kind && details(g, foe(kind), tall => [clamp(x + w - DW, 8, W - 8 - DW), up ? y - 6 - tall : y + h + 6])
  else note(g, [M.say], clamp(x, 4, W - 140), up ? y - 4 : y + h + 4, false, up)
}, { shop: false, click }))
