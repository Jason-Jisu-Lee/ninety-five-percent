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
import { orb } from '../ui/parts/icons'
import { note } from '../ui/parts/note'
import { soft } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { figure } from './base'

type Hit = [x: number, y: number, w: number, h: number]
type What = 'foe' | 'gene' | 'lair'
type Hot = [what: What, top: number] | undefined
type Row = [name: string, cost?: number, what?: What]
const STEPS = [[0, 6], [0, 15], [2, 60], [2, 230]], HIDE = '?????', LAIR = 'Return to Lair', R = W - 8, B = H - 8, WIDE = 132, X = R - WIDE
let step = 0
const now = () => WILD[pack.got], next = () => WILD[pack.got + 1], can = (n = 0) => save.blood >= n
const label = (w: Wild) => w.kind ? w.name : 'Expansion: ' + w.name
const inside = (mx: number, my: number, [x, y, w, h]: Hit) => mx >= x && mx < x + w && my >= y && my < y + h
const gene = (): Row[] => offered() ? [[M.name, M.cost, 'gene']] : [], buys = (): Row[] => [[label(now()), now().cost, 'foe'], [HIDE, next().cost]], exit: Row = [LAIR, undefined, 'lair']
const pay = (g: Ctx, n: number, r: number, y: number, col: string) => {
  const p = String(n)
  text(g, p, r, y, col, 'r')
  orb(g, r - width(p) - 5, y - 4, col === UI.text ? '' : col)
}

function words(g: Ctx, [name, cost, what]: Row, y: number, on: boolean, gilt: boolean) {
  const ok = !!what && can(cost)
  if (cost === undefined) return text(g, name, X + WIDE / 2, y, on ? UI.gold : UI.text, 'c')
  text(g, name, X + 7, y, !what ? UI.dim : on || gilt && ok ? UI.gold : UI.text)
  pay(g, cost, R - 7, y, ok ? UI.text : UI.dim)
}

function stack(rows: Row[], pitch: number, tall: number, mx: number, my: number, draw: (row: Row, y: number, on: boolean, i: number) => void, bottom = B) {
  let hot: Hot
  const top = bottom - (rows.length - 1) * pitch - tall
  rows.forEach((row, i) => {
    const y = top + i * pitch, on = !!row[2] && inside(mx, my, [X, y, WIDE, pitch])
    draw(row, y, on, i)
    if (on) hot = [row[2]!, top]
  })
  return hot
}

const WAYS: [string, string, (g: Ctx, mx: number, my: number) => Hot][] = [
  ['Lair rows', 'The one you liked: the same dark buttons as in the Lair. Mutations now joins the same column, on top', (g, mx, my) =>
    stack([...gene(), exit, ...buys()], 19, 17, mx, my, (row, y, on) => {
      frame(g, X, y, WIDE, 17, on)
      words(g, row, y + 12, on, false)
    })],
  ['One menu', 'The other one you liked: one soft box, one thing per row, Return to Lair at the bottom. Mutations joins as a new row on top', (g, mx, my) => {
    const rows = [...gene(), ...buys(), exit]
    soft(g, X, B - rows.length * 16 - 5, WIDE, rows.length * 16 + 5, UI.line)
    return stack(rows, 16, 16, mx, my, (row, y, on, i) => {
      g.fillStyle = UI.line
      if (on) g.fillRect(X + 3, y, WIDE - 6, 15)
      if (row === exit) g.fillRect(X + 3, y - 1, WIDE - 6, 1)
      words(g, row, y + 12 + +(i === rows.length - 1), on, true)
    }, B - 2)
  }],
  ['Joined rows', 'The Lair buttons joined into one sharp box with thin lines between the rows. The row under the pointer gets the gold edge', (g, mx, my) => {
    const rows = [...gene(), ...buys(), exit]
    frame(g, X, B - rows.length * 17 - 1, WIDE, rows.length * 17 + 1, false)
    return stack(rows, 17, 18, mx, my, (row, y, on) => {
      g.fillStyle = UI.line
      g.fillRect(X, y, WIDE, 1)
      if (on) frame(g, X, y, WIDE, 18, true)
      words(g, row, y + 13, on, false)
    })
  }],
  ['Menu, Lair apart', 'One soft box for what you buy, and Return to Lair as its own bigger button under it with a gold edge, because it is the big decision', (g, mx, my) => {
    const rows = [...gene(), ...buys()], onLair = inside(mx, my, [X, B - 19, WIDE, 19])
    soft(g, X, B - 19, WIDE, 19, onLair ? UI.text : UI.gold)
    text(g, LAIR, X + WIDE / 2, B - 6, onLair ? UI.gold : UI.text, 'c')
    soft(g, X, B - 27 - rows.length * 16, WIDE, rows.length * 16 + 4, UI.line)
    return stack(rows, 16, 16, mx, my, (row, y, on) => {
      g.fillStyle = UI.line
      if (on) g.fillRect(X + 3, y, WIDE - 6, 15)
      words(g, row, y + 12, on, true)
    }, B - 25) ?? (onLair ? ['lair', B - 27 - rows.length * 16] : undefined)
  }],
  ['Soft rows', 'Separate see-through rows with rounded corners, the look the bar has in the game now, for every row. Gold edge when you can pay', (g, mx, my) =>
    stack([...gene(), ...buys(), exit], 18, 15, mx, my, (row, y, on) => {
      soft(g, X, y, WIDE, 15, row[2] && row !== exit && can(row[1]) ? on ? UI.text : UI.gold : on ? UI.gold : UI.line)
      words(g, row, y + 11, on, true)
    })],
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
  else note(g, [hot[0] === 'gene' ? M.say : 'End this run'], X, hot[1] - 4, false, true)
}, { shop: false, lair: false, click, view: [240, 96, 400, 264] }))
