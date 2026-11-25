import './seed'
import { save } from '../core/save/save'
import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { orb } from '../ui/parts/icons'
import { note } from '../ui/parts/note'
import { panel } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { SLOTS } from '../ui/wild/next'
import { figure } from './base'

type Hit = [x: number, y: number, w: number, h: number]
const NAME = 'Return to Lair', TIP = 'End this run', TW = width(NAME)
const inside = (mx: number, my: number, [x, y, w, h]: Hit) => mx >= x && mx < x + w && my >= y && my < y + h
const soft = (g: Ctx, x: number, y: number, w: number, h: number, edge: string) => {
  g.globalAlpha = .84
  panel(g, x, y, w, h, edge, UI.panel)
  g.globalAlpha = 1
}

const WAYS: [string, string, boolean, (g: Ctx, mx: number, my: number) => void][] = [
  ['Counter plate', 'Top left. One soft plate holds the lifeblood counter and, after a thin line, the button. The words and the edge turn gold under the pointer', false, (g, mx, my) => {
    const n = String(Math.floor(save.blood)), cut = 30 + width(n), w = cut + TW + 14, hit: Hit = [cut, 6, w - cut + 6, 19], hot = inside(mx, my, hit)
    soft(g, 6, 6, w, 19, hot ? UI.gold : UI.line)
    orb(g, 16, 15)
    text(g, n, 24, 19, UI.text)
    g.fillStyle = UI.line
    g.fillRect(cut, 9, 1, 13)
    text(g, NAME, cut + 7, 19, hot ? UI.gold : UI.text)
    if (hot) note(g, [TIP], 6, 28)
  }],
  ['Edge tab', 'A tab fixed to the left edge of the screen under the counter. It slides out a little and turns gold under the pointer', true, (g, mx, my) => {
    const hit: Hit = [0, 30, TW + 14, 15], hot = inside(mx, my, hit), out = hot ? 3 : 0
    soft(g, -4, 30, TW + 18 + out, 15, hot ? UI.gold : UI.line)
    g.fillStyle = UI.gold
    g.fillRect(0, 32, 2, 11)
    text(g, NAME, 7 + out, 41, hot ? UI.gold : UI.text)
    if (hot) note(g, [TIP], TW + 22, 28)
  }],
  ['Action stack', 'Bottom right, right above the in-run shop bar and in the same style: both things you spend lifeblood on sit together', true, (g, mx, my) => {
    const [x, y, w] = SLOTS, hit: Hit = [x, y - 19, w, 15], hot = inside(mx, my, hit)
    soft(g, x, y - 19, w, 15, hot ? UI.gold : UI.line)
    text(g, NAME, x + 6, y - 8, hot ? UI.gold : UI.text)
    if (hot) note(g, [TIP], x, y - 19, false, true)
  }],
  ['Bottom left, two lines', 'Bottom left corner. What it does is written under the name, so nothing is hidden behind a hover', true, (g, mx, my) => {
    const w = TW + 14, hit: Hit = [8, H - 36, w, 28], hot = inside(mx, my, hit)
    soft(g, 8, H - 36, w, 28, hot ? UI.gold : UI.line)
    text(g, NAME, 15, H - 24, hot ? UI.gold : UI.text)
    text(g, TIP, 15, H - 13, UI.dim)
  }],
  ['Bottom centre', 'Centred at the bottom of the screen, where exit prompts usually sit. Gold under the pointer', true, (g, mx, my) => {
    const w = TW + 24, x = W - w >> 1, hit: Hit = [x, H - 23, w, 15], hot = inside(mx, my, hit)
    soft(g, x, H - 23, w, 15, hot ? UI.gold : UI.line)
    text(g, NAME, W / 2, H - 12, hot ? UI.gold : UI.text, 'c')
    if (hot) note(g, [TIP], x, H - 23, false, true)
  }],
]

const host = document.querySelector('section')!
WAYS.forEach(([name, say, counter, draw], i) => figure(host, i + 1, name, say, draw, { counter, lair: false }))
