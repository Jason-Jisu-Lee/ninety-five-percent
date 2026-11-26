import './seed'
import { LAIR } from '../data/look/lair'
import { UI } from '../data/look/palette'
import { H } from '../data/look/screen'
import { disc } from '../ui/parts/disc'
import { note } from '../ui/parts/note'
import { figure } from './base'

const R = 16, CX = 8 + R, CY = H - 8 - R, VIEW = [0, 250, 130, 110], TIP = ['Return to Lair', 'End this run']
const INK: Record<string, string[]> = { '#': [UI.text, UI.gold], o: [UI.text, UI.gold], s: ['#a8a294', '#8f7642'] }
const SOLID = LAIR.map(row => row.replace(/\+/g, '#'))

const host = document.querySelector('section')!
figure(host, 'Now', 'In the game', 'See-through wings, seen from above', () => {}, { shop: false, view: VIEW })
figure(host, 1, 'Solid wings', 'The same drawing with the wings filled in', (g, mx, my) => {
  const hot = Math.hypot(mx - CX, my - CY) < R + 1
  disc(g, CX, CY, R, hot ? UI.gold : UI.line)
  SOLID.forEach((row, j) => [...row].forEach((ch, i) => {
    g.fillStyle = INK[ch]?.[+hot]
    if (ch !== '.') for (const x of i ? [CX - i, CX + i] : [CX]) g.fillRect(x, CY - 11 + j, 1, 1)
  }))
  if (hot) note(g, TIP, CX - R, CY - R - 4, false, true)
}, { shop: false, lair: false, view: VIEW })
