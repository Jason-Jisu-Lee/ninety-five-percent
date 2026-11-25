import './seed'
import { offered } from '../core/save/mutate'
import { save } from '../core/save/save'
import { pack } from '../core/save/wild'
import type { Ctx } from '../core/screen/canvas'
import { MUTATE as M } from '../data/game/mutations'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { WILD, type Wild } from '../data/shop/wild'
import { foe } from '../ui/enemy/card'
import { details, DW } from '../ui/parts/details'
import { frame } from '../ui/parts/frame'
import { key } from '../ui/parts/key'
import { orb } from '../ui/parts/icons'
import { note } from '../ui/parts/note'
import { box, soft } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { figure } from './base'

type Hit = [x: number, y: number, w: number, h: number]
type What = 'foe' | 'gene' | 'lair'
type Hot = [what: What, top: number, right: number] | undefined
const STEPS = [[0, 6], [0, 15], [2, 60], [2, 230]], HIDE = '?????', LAIR = 'Return to Lair', R = W - 8, B = H - 8
let step = 0
const now = () => WILD[pack.got], next = () => WILD[pack.got + 1], can = (n: number) => save.blood >= n
const label = (w: Wild) => w.kind ? w.name : 'Expansion: ' + w.name
const inside = (mx: number, my: number, [x, y, w, h]: Hit) => mx >= x && mx < x + w && my >= y && my < y + h
const pay = (g: Ctx, n: number, r: number, y: number, col: string, edge?: string) => {
  const p = String(n)
  text(g, p, r, y, col, 'r', edge)
  orb(g, r - width(p) - 5, y - 4, col === UI.text ? '' : col, edge)
}

const WAYS: [string, string, (g: Ctx, mx: number, my: number) => Hot][] = [
  ['Lair rows', 'The same buttons as in the Lair: dark rows with a thin edge, name on the left, price on the right. The price is bright when you can pay. Gold under the pointer', (g, mx, my) => {
    const w = 128, x = R - w, gw = 92, gx = x - 4 - gw, top = B - 55, onLair = inside(mx, my, [x, top, w, 17])
    let hot: Hot
    const row = (name: string, cost: number, bx: number, by: number, bw: number, live = true) => {
      const on = live && inside(mx, my, [bx, by, bw, 17])
      frame(g, bx, by, bw, 17, on)
      text(g, name, bx + 7, by + 12, !live ? UI.dim : on ? UI.gold : UI.text)
      pay(g, cost, bx + bw - 7, by + 12, live && can(cost) ? UI.text : UI.dim)
      return on
    }
    frame(g, x, top, w, 17, onLair)
    text(g, LAIR, x + w / 2, top + 12, onLair ? UI.gold : UI.text, 'c')
    if (onLair) hot = ['lair', top, R]
    if (row(label(now()), now().cost, x, B - 36, w)) hot = ['foe', top, R]
    row(HIDE, next().cost, x, B - 17, w, false)
    if (offered() && row(M.name, M.cost, gx, B - 36, gw)) hot = ['gene', B - 36, gx + gw]
    return hot
  }],
  ['One menu', 'One soft box in the corner holds everything you can press, one thing per row. Mutations joins as a new row on top. The row under the pointer lights up', (g, mx, my) => {
    const w = 132, x = R - w, tall = (offered() ? 4 : 3) * 16 + 5, top = B - tall
    let hot: Hot, at = top + 2
    soft(g, x, top, w, tall, UI.line)
    const row = (name: string, cost?: number, what?: What) => {
      const on = !!what && inside(mx, my, [x, at, w, 16]), ok = !!what && can(cost ?? 0)
      g.fillStyle = UI.line
      if (on) g.fillRect(x + 2, at, w - 4, 16)
      if (cost === undefined) text(g, name, x + w / 2, at + 12, on ? UI.gold : UI.text, 'c')
      else text(g, name, x + 7, at + 12, !what ? UI.dim : ok ? UI.gold : UI.text), pay(g, cost, x + w - 7, at + 12, ok ? UI.text : UI.dim)
      if (on) hot = [what!, top, R]
      at += 16
    }
    if (offered()) row(M.name, M.cost, 'gene')
    row(label(now()), now().cost, 'foe')
    row(HIDE, next().cost)
    g.fillStyle = UI.line
    g.fillRect(x + 3, at, w - 6, 1)
    at++
    row(LAIR, undefined, 'lair')
    return hot
  }],
  ['Number keys', 'Each thing you can buy has a number key on it, like a hotbar, so you can buy without moving the pointer off your prey. Clicking works too. Gold edge when you can pay', (g, mx, my) => {
    const w = 132, x = R - w, gw = 100, gx = x - 4 - gw, top = B - 51, onLair = inside(mx, my, [x, top, w, 15])
    let hot: Hot
    const row = (name: string, cost: number, bx: number, bw: number, cap: string) => {
      const on = inside(mx, my, [bx, B - 32, bw, 17]), ok = can(cost)
      soft(g, bx, B - 32, bw, 17, ok ? on ? UI.text : UI.gold : UI.line)
      key(g, bx + 4, B - 30, cap)
      text(g, name, bx + 20, B - 20, ok ? UI.gold : UI.text)
      pay(g, cost, bx + bw - 6, B - 20, ok ? UI.text : UI.dim)
      return on
    }
    soft(g, x, top, w, 15, onLair ? UI.gold : UI.line)
    text(g, LAIR, x + w / 2, top + 11, onLair ? UI.gold : UI.text, 'c')
    if (onLair) hot = ['lair', top, R]
    if (row(label(now()), now().cost, x, w, '1')) hot = ['foe', top, R]
    text(g, HIDE, x + 20, B - 2, UI.dim, undefined, UI.panel)
    pay(g, next().cost, R - 6, B - 2, UI.dim, UI.panel)
    if (offered() && row(M.name, M.cost, gx, gw, '2')) hot = ['gene', B - 32, gx + gw]
    return hot
  }],
  ['Price buttons', 'No box around the names. The price itself is the button: solid gold when you can pay, a dark outline when you cannot. White under the pointer', (g, mx, my) => {
    const top = B - (offered() ? 64 : 47)
    let hot: Hot
    const row = (name: string, cost: number, y: number, what?: What) => {
      const pw = width(String(cost)) + 19, px = R - pw, ok = !!what && can(cost), on = !!what && inside(mx, my, [px - 8 - width(name), y, width(name) + 8 + pw, 13]), fill = on ? UI.text : UI.gold
      text(g, name, px - 6, y + 10, !what ? UI.dim : on ? UI.gold : UI.text, 'r', UI.panel)
      g.globalAlpha = ok ? 1 : .84
      box(g, px, y, pw, 13, ok ? fill : UI.line, ok ? fill : UI.panel)
      g.globalAlpha = 1
      pay(g, cost, R - 6, y + 10, ok ? UI.panel : UI.dim)
      if (on) hot = [what!, top, R]
    }
    const lw = width(LAIR) + 14, onLair = inside(mx, my, [R - lw, B - 13, lw, 13])
    if (offered()) row(M.name, M.cost, B - 64, 'gene')
    row(label(now()), now().cost, B - 47, 'foe')
    row(HIDE, next().cost, B - 30)
    g.globalAlpha = .84
    box(g, R - lw, B - 13, lw, 13, onLair ? UI.gold : UI.border, UI.panel)
    g.globalAlpha = 1
    text(g, LAIR, R - lw / 2, B - 3, onLair ? UI.gold : UI.text, 'c')
    if (onLair) hot = ['lair', top, R]
    return hot
  }],
  ['No boxes', 'Plain outlined words, like the lifeblood counter. What you can pay for turns gold with a gold line under it. White under the pointer', (g, mx, my) => {
    const lw = width(LAIR) + 14, top = B - 44, onLair = inside(mx, my, [R - lw, top, lw, 15])
    let hot: Hot
    const row = (name: string, cost: number, r: number, y: number, what?: What) => {
      const wide = width(name) + width(String(cost)) + 22, ok = !!what && can(cost), on = !!what && inside(mx, my, [r - wide, y - 10, wide, 14])
      text(g, name, r - wide, y, !what ? UI.dim : on ? UI.text : ok ? UI.gold : UI.text, undefined, UI.panel)
      pay(g, cost, r, y, ok ? UI.text : UI.dim, UI.panel)
      if (ok) for (const [col, o] of [[UI.panel, 1], [on ? UI.text : UI.gold, 0]] as const) {
        g.fillStyle = col
        g.fillRect(r - wide - o, y + 3 - o, wide + o * 2, 1 + o * 2)
      }
      if (on) hot = [what!, what === 'gene' ? y - 12 : top, r]
    }
    soft(g, R - lw, top, lw, 15, onLair ? UI.gold : UI.line)
    text(g, LAIR, R - lw / 2, top + 11, onLair ? UI.gold : UI.text, 'c')
    if (onLair) hot = ['lair', top, R]
    row(label(now()), now().cost, R, B - 17, 'foe')
    row(HIDE, next().cost, R, B - 2)
    if (offered()) row(M.name, M.cost, R - 130, B - 17, 'gene')
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
  if (hot[0] === 'foe') kind && details(g, foe(kind), tall => [W - 8 - DW, hot[1] - 6 - tall])
  else note(g, [hot[0] === 'gene' ? M.say : 'End this run'], hot[2], hot[1] - 4, true, true)
}, { shop: false, lair: false, click, view: [240, 96, 400, 264] }))
