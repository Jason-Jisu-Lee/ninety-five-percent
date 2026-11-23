import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { frame } from '../ui/parts/frame'
import { text, width } from '../ui/text/text'
import { art, view } from './kit'

type Look = { name: string; note: string; cols: Record<string, string>; rows?: string[]; word?: string }

const RED = '#d8442c', DARK = '#9c2a22', SH = 100, LOOKS: Look[] = [
  { name: 'Red drop', note: 'What the game has', cols: { '#': RED }, rows: ['..#..', '..#..', '.###.', '.###.', '#####', '#####', '.###.'] },
  { name: 'Soft drop', note: 'The same drop in rose with a shine. Reads as a jewel more than a wound', cols: { '#': '#e0566a', o: '#f8c4cc' }, rows: ['..#..', '..#..', '.###.', '.#o#.', '#o###', '#####', '.###.'] },
  { name: 'Small wine droplet', note: 'Smaller and darker, so it stands back behind the number', cols: { '#': '#b03a48' }, rows: ['.....', '..#..', '..#..', '.###.', '.###.', '.###.', '.....'] },
  { name: 'Orb', note: 'A round bead with a shine. The usual shape for souls and essence, as in Hades and Dead Cells', cols: { '#': RED, o: '#f6b09c', d: DARK }, rows: ['.....', '.###.', '#o###', '#####', '###d#', '.###.', '.....'] },
  { name: 'Blood cell', note: 'A flat disc with a dimple, as under a microscope. Clean and a little playful', cols: { '#': RED, d: DARK }, rows: ['.......', '.#####.', '#######', '##ddd##', '#######', '.#####.', '.......'] },
  { name: 'Letters only', note: 'No icon. The number followed by BP, like HP and XP', cols: { '#': RED }, word: 'BP' },
]

function icon(g: Ctx, l: Look, x: number, y: number, edge = false) {
  const rows = l.rows!, half = rows[0].length >> 1
  for (const [dx, dy] of edge ? [...Array(9)].map((_, i) => [i % 3 - 1, (i / 3 | 0) - 1]) : []) rows.forEach((row, j) => {
    g.fillStyle = UI.panel
    for (let i = 0; i < row.length; i++) if (row[i] !== '.') g.fillRect(x - half + i + dx, y - 3 + j + dy, 1, 1)
  })
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] !== '.') {
      g.fillStyle = l.cols[row[i]]
      g.fillRect(x - half + i, y - 3 + j, 1, 1)
    }
  })
}

function amount(g: Ctx, l: Look, n: string, right: number, y: number, edge = false, k = 1) {
  const e = edge ? UI.panel : undefined
  if (l.word) {
    text(g, l.word, right, y, l.cols['#'], 'r', e, k)
    return text(g, n, right - (width(l.word) + 4) * k, y, UI.text, 'r', e, k)
  }
  text(g, n, right, y, UI.text, 'r', e, k)
  icon(g, l, right - width(n) * k - 3 - (l.rows![0].length >> 1) - k, y - 4 - (k - 1) * 3, edge)
}

LOOKS.forEach((l, n) => {
  const v = view(`<b>${n || 'Now'}</b>${l.name}<br><i>${l.note}</i>`, 400, SH, 240), g = v.low, big = ctx(mk(9, 9)), paint = () => {
    g.drawImage(art, -240, 0)
    amount(g, l, '128', l.word ? 14 + width('128 BP') : 23 + (l.rows![0].length >> 1) + width('128'), 19, true)
    text(g, '+1', 120, 44, l.cols['#'], 'c', UI.panel)
    g.fillStyle = UI.night
    g.fillRect(0, 64, 400, 36)
    frame(g, 8, 73, 184, 17, false)
    text(g, 'Sharp Mandibles', 15, 85, UI.text)
    amount(g, l, '5', 185, 85)
    amount(g, l, '128', 392, 91, false, 2)
    if (l.word) text(g, l.word, 250, 93, l.cols['#'], 'c', undefined, 3)
    else {
      big.clearRect(0, 0, 9, 9)
      icon(big, l, 4, 4)
      g.imageSmoothingEnabled = false
      g.drawImage(big.canvas, 232, 64, 36, 36)
    }
    v.show()
  }
  paint()
  setTimeout(paint, 500)
})
