import './seed'
import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { orb } from '../ui/parts/icons'
import { note } from '../ui/parts/note'
import { box, panel } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { figure } from './base'

const NAME = 'Return to Lair', X = 8, Y = 30, TW = width(NAME)
const on = (mx: number, my: number, w: number, h: number) => mx >= X && mx < X + w && my >= Y && my < Y + h
const tip = (g: Ctx, w: number) => note(g, ['End this run'], X + w + 4, Y - 2)

function back(g: Ctx, x: number, y: number, col: string) {
  for (let n = 0; n < 10; n++) {
    g.fillStyle = n < 9 ? UI.panel : col
    for (const [i, j] of [[3, 0], [2, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 6]]) g.fillRect(x + i + (n < 9 ? n % 3 - 1 : 0), y + j + (n < 9 ? (n / 3 | 0) - 1 : 0), 1, 1)
  }
}

const WAYS: [string, string, (g: Ctx, hot: boolean) => number][] = [
  ['Now, renamed', 'The current gold box with the new words', (g, hot) => {
    const w = TW + 10
    box(g, X, Y, w, 15, hot ? UI.text : UI.gold, UI.panel)
    text(g, NAME, X + 5, Y + 11, UI.text)
    return w
  }],
  ['Plain words', 'No box. Outlined words with a back arrow, like the quest text and the top right icons. Gold under the pointer', (g, hot) => {
    const col = hot ? UI.gold : UI.text
    back(g, X + 1, Y + 4, col)
    text(g, NAME, X + 9, Y + 11, col, undefined, UI.panel)
    return TW + 10
  }],
  ['Soft panel', 'A see-through dark panel like the details cards, with a thin grey edge that turns gold under the pointer', (g, hot) => {
    const w = TW + 14
    g.globalAlpha = .84
    panel(g, X, Y - 1, w, 17, hot ? UI.gold : UI.line, UI.panel)
    g.globalAlpha = 1
    text(g, NAME, X + 7, Y + 11, hot ? UI.gold : UI.text)
    return w
  }],
  ['Lifeblood drop', 'The lifeblood drop in front of the words, since the Lair is where lifeblood is spent. No box', (g, hot) => {
    orb(g, X + 3, Y + 7, '', UI.panel)
    text(g, NAME, X + 10, Y + 11, hot ? UI.gold : UI.text, undefined, UI.panel)
    return TW + 12
  }],
  ['Gold button', 'A filled gold button with dark words, the usual look of a main action. Brighter under the pointer', (g, hot) => {
    const w = TW + 10
    box(g, X, Y, w, 15, UI.panel, hot ? UI.border : UI.gold)
    text(g, NAME, X + 5, Y + 11, UI.panel)
    return w
  }],
]

const host = document.querySelector('section')!
WAYS.forEach(([name, say, draw], i) => {
  let w = 0
  figure(host, i + 1, name, say, (g, mx, my) => {
    const hot = on(mx, my, w, 15)
    w = draw(g, hot)
    if (hot) tip(g, w)
  })
})
