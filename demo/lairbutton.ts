import './seed'
import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { note } from '../ui/parts/note'
import { soft } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { SLOTS } from '../ui/wild/next'
import { figure } from './base'

type Hit = [x: number, y: number, w: number, h: number]
const TIP = ['Return to Lair', 'End this run'], [SX, SY, SW] = SLOTS, TW = Math.max(...TIP.map(width)) + 10
const ART = {
  back: ['...#.......', '..##.......', '.########..', '..##....##.', '...#.....#.', '.........#.', '........##.', '...######..'],
  home: ['.....#.....', '....###....', '...#####...', '..#######..', '.#########.', '..#######..', '..###.###..', '..###.###..', '..###.###..'],
  cave: ['...#####...', '..#######..', '.####.####.', '.###...###.', '###.....###', '###.....###', '###.....###'],
  door: ['....#######', '....#.....#', '..#.......#', '.##.......#', '########..#', '.##.......#', '..#.......#', '....#.....#', '....#######'],
}
const inside = (mx: number, my: number, [x, y, w, h]: Hit) => mx >= x && mx < x + w && my >= y && my < y + h

function button(g: Ctx, mx: number, my: number, hit: Hit, art: string[] | string, [x, y, w, h] = hit) {
  const hot = inside(mx, my, hit), col = hot ? UI.gold : UI.text
  soft(g, x, y, w, h, hot ? UI.gold : UI.line)
  g.fillStyle = col
  if (typeof art === 'string') text(g, art, x + w / 2, y + 11, col, 'c')
  else art.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] === '#') g.fillRect(x + (w - row.length >> 1) + i, y + (h - art.length >> 1) + j, 1, 1)
  })
  return hot
}

const WAYS: [string, string, (g: Ctx, mx: number, my: number) => void][] = [
  ['Return arrow', 'A small square button with a return arrow, bottom right, above the in-run shop', (g, mx, my) => {
    if (button(g, mx, my, [SX + SW - 19, SY - 19, 19, 15], ART.back)) note(g, TIP, SX + SW, SY - 23, true, true)
  }],
  ['Home', 'A house, top left under the lifeblood counter', (g, mx, my) => {
    if (button(g, mx, my, [8, 30, 19, 15], ART.home)) note(g, TIP, 31, 28)
  }],
  ['Cave', 'The mouth of a lair, centred at the bottom of the screen', (g, mx, my) => {
    if (button(g, mx, my, [W / 2 - 10, H - 23, 21, 15], ART.cave)) note(g, TIP, W - TW >> 1, H - 27, false, true)
  }],
  ['Way out', 'An exit sign on the left edge, the side the dragonfly leaves by. It slides out a little under the pointer', (g, mx, my) => {
    const hot = inside(mx, my, [0, 168, 19, 19])
    if (button(g, mx, my, [0, 168, 19, 19], ART.door, [-4, 168, hot ? 26 : 23, 19])) note(g, TIP, 28, 166)
  }],
  ['One word', 'A plain small button that reads Lair, bottom right, above the in-run shop', (g, mx, my) => {
    const w = width('Lair') + 16
    if (button(g, mx, my, [SX + SW - w, SY - 19, w, 15], 'Lair')) note(g, TIP, SX + SW, SY - 23, true, true)
  }],
]

const host = document.querySelector('section')!
WAYS.forEach(([name, say, draw], i) => figure(host, i + 1, name, say, draw, { lair: false }))
