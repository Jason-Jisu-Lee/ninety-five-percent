import type { Ctx } from '../core/screen/canvas'
import { FOREST as C, UI } from '../data/look/palette'
import { drop } from '../ui/parts/icons'
import { box, panel } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { art, OLD, quest, R, view } from './kit'

const LEFT = 240, SH = 84, PAY = '5', WIDE = width(OLD)
const ink = (g: Ctx, x: number, y: number) => {
  for (let i = 0; i < 9; i++) drop(g, x - 1 + i % 3, y - 1 + (i / 3 | 0), UI.panel)
  drop(g, x, y, C.red)
}
const plain = (g: Ctx) => quest(g, OLD, '2 / 3', UI.text)

const OPTIONS: [name: string, note: string, draw: (g: Ctx) => void][] = [
  ['A third line: drop and number', 'What you tested', g => {
    plain(g)
    text(g, PAY, R, 65, UI.text, 'r', UI.panel)
    ink(g, R - width(PAY) - 6, 61)
  }],
  ['A third line: gold +5', 'Reads as a gain. The usual form in action and role playing games', g => {
    plain(g)
    text(g, '+' + PAY, R, 65, UI.gold, 'r', UI.panel)
    ink(g, R - width('+' + PAY) - 6, 61)
  }],
  ['Reward tag', 'The reward sits in its own small dark tag under the quest. Common in mobile and idle games', g => {
    const w = width(PAY) + 19
    plain(g)
    box(g, R - w, 58, w, 13, UI.border, UI.panel)
    text(g, PAY, R - 5, 68, UI.text, 'r')
    drop(g, R - width(PAY) - 10, 64, C.red)
  }],
  ['Quest card', 'The whole quest sits on a dark card, reward under a divider. The tracker of online role playing games', g => {
    const x = R - WIDE - 9
    g.globalAlpha = .84
    panel(g, x, 30, WIDE + 15, 46, UI.border, UI.panel)
    g.globalAlpha = 1
    text(g, OLD, R - 2, 43, UI.text, 'r')
    text(g, '2 / 3', R - 2, 55, UI.accent, 'r')
    g.fillStyle = UI.line
    g.fillRect(x + 5, 59, WIDE + 5, 1)
    text(g, PAY, R - 2, 70, UI.text, 'r')
    drop(g, R - width(PAY) - 7, 66, C.red)
  }],
  ['Reward on the side', 'The reward stands left of the quest behind a thin line. Common in mobile quest lists', g => {
    const x = R - WIDE - 7
    plain(g)
    g.fillStyle = UI.panel
    g.fillRect(x - 1, 33, 3, 23)
    g.fillStyle = UI.border
    g.fillRect(x, 34, 1, 21)
    text(g, PAY, x - 6, 48, UI.text, 'r', UI.panel)
    ink(g, x - width(PAY) - 12, 44)
  }],
  ['Progress bar with the reward at its end', 'The count sits by a bar and the reward waits where the bar ends. The battle pass style', g => {
    const w = 64, x = R - width(PAY) - 14 - w
    text(g, OLD, R, 41, UI.text, 'r', UI.panel)
    g.fillStyle = UI.panel
    g.fillRect(x - 1, 47, w + 2, 6)
    g.fillStyle = UI.line
    g.fillRect(x, 48, w, 4)
    g.fillStyle = UI.accent
    g.fillRect(x, 48, Math.round(w * 2 / 3), 4)
    text(g, PAY, R, 54, UI.text, 'r', UI.panel)
    ink(g, R - width(PAY) - 6, 50)
    text(g, '2 / 3', x - 6, 54, UI.accent, 'r', UI.panel)
  }],
]

OPTIONS.forEach(([name, note, draw], n) => {
  const v = view(`<b>${n || 'Now'}</b>${name}<br><i>${note}</i>`, 400, SH, LEFT), g = v.low, paint = () => {
    g.setTransform(1, 0, 0, 1, -LEFT, 0)
    g.drawImage(art, 0, 0)
    draw(g)
    v.show()
  }
  paint()
  setTimeout(paint, 500)
})
