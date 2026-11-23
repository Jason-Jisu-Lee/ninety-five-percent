import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { logo } from '../ui/front/logo'
import { box } from '../ui/parts/panel'
import { glyph } from '../ui/text/text'
import { scene } from '../world/place/place'

type Look = { ink: (r: number) => string; edge?: string; drop?: string; deep?: string }

const K = 3, VW = 272, VH = 82, X = 22, Y = 20, CREAM = '#ece5d5', GOLD = UI.gold, RED = '#c2442c', DARK = '#0b1716', A = 'NINETY-FIVE', B = 'PERCENT'
const flat = (col: string): Look => ({ ink: () => col, drop: DARK })

function word(g: Ctx, str: string, x: number, y: number, s: number, { ink, edge, drop, deep }: Look, pitch = 6) {
  const cells: number[][] = []
  ;[...str].forEach((ch, n) => glyph(ch).forEach((row, r) => {
    for (let c = 0; c < 5; c++) if (row >> 4 - c & 1) cells.push([x + Math.round((n * pitch + c) * s), y + r * s, r])
  }))
  const fill = (col: string, dx: number, dy: number, grow = 0, tall = 0) => {
    g.fillStyle = col
    for (const [px, py] of cells) g.fillRect(px + dx - grow, py + dy - grow, s + grow * 2, s + grow * 2 + tall)
  }
  if (drop) fill(drop, 2, 2)
  if (edge) fill(edge, 0, 0, 1, deep ? 2 : 0)
  if (deep) fill(deep, 0, 2)
  for (const [px, py, r] of cells) {
    g.fillStyle = ink(r)
    g.fillRect(px, py, s, s)
  }
}

const OPTIONS: [name: string, note: string, draw: (g: Ctx) => void][] = [
  ['What the game has', 'Two tones per letter, a dark outline, both lines the same size', g => g.drawImage(logo(), X - 2, Y - 2)],
  ['One colour, hard shadow', 'No outline. The cleanest version', g => {
    word(g, A, X, Y, 3, flat(CREAM))
    word(g, B, X, Y + 32, 3, flat(CREAM))
  }],
  ['Gold second line', 'Version 1 with PERCENT in the gold of the shop', g => {
    word(g, A, X, Y, 3, flat(CREAM))
    word(g, B, X, Y + 32, 3, flat(GOLD))
  }],
  ['Red second line', 'Version 1 with PERCENT in the red of the blood orb', g => {
    word(g, A, X, Y, 3, flat(CREAM))
    word(g, B, X, Y + 32, 3, flat(RED))
  }],
  ['Small second line under a rule', 'NINETY-FIVE leads. PERCENT is smaller and spaced out', g => {
    word(g, A, X, Y, 3, flat(CREAM))
    g.fillStyle = DARK
    g.fillRect(X + 2, Y + 29, 195, 1)
    g.fillStyle = GOLD
    g.fillRect(X, Y + 27, 195, 1)
    word(g, B, X, Y + 33, 2, flat(GOLD), 9)
  }],
  ['Raised letters', 'Light on top, gold below, with a dark base under each letter. The classic pixel logo', g => {
    const look: Look = { ink: r => r < 2 ? '#f6efe0' : r < 5 ? '#e3d6b4' : GOLD, edge: DARK, deep: '#6e5a30' }
    word(g, A, X, Y, 3, look)
    word(g, B, X, Y + 33, 3, look)
  }],
  ['Dark plate', 'The title on the same dark box as the menu buttons', g => {
    box(g, X - 7, Y - 7, 211, 67, UI.border, UI.panel)
    word(g, A, X, Y, 3, { ink: () => CREAM })
    word(g, B, X, Y + 32, 3, { ink: () => GOLD })
  }],
  ['One line', 'Both words on one line at two thirds of the size', g => {
    word(g, A + ' ' + B, X, Y, 2, flat(CREAM))
    g.fillStyle = DARK
    g.fillRect(X + 2, Y + 20, 226, 1)
    g.fillStyle = GOLD
    g.fillRect(X, Y + 18, 226, 1)
  }],
]

OPTIONS.forEach(([name, note, draw], n) => {
  const fig = document.getElementById('options')!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(VW * K, VH * K)), g = ctx(c), low = ctx(mk(VW, VH))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n || 'Now'}</b>${name}<br><i>${note}</i></figcaption>`)
  fig.style.width = VW * K + 4 + 'px'
  g.imageSmoothingEnabled = false
  low.drawImage(scene(1).art, 0, 0)
  draw(low)
  g.drawImage(low.canvas, 0, 0, VW * K, VH * K)
})
