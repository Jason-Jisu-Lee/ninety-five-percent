import './seed'
import { UI } from '../data/look/palette'
import { H } from '../data/look/screen'
import { disc } from '../ui/parts/disc'
import { note } from '../ui/parts/note'
import { figure } from './base'

const R = 16, CX = 8 + R, CY = H - 8 - R, VIEW = [0, 250, 130, 110], TIP = ['Return to Lair', 'End this run']
const INK: Record<string, string[]> = { '#': [UI.text, UI.gold], o: [UI.text, UI.gold], '+': ['#77756a', '#6b5a35'], s: ['#a8a294', '#8f7642'] }
const ART: [string, string, number, string[]][] = [
  ['Bold', 'Solid wings, no see-through fill: the strongest shape from far away', 7, [
    '..............ooo..............',
    '.....##......ooooo......##.....',
    '...########..ooooo..########...',
    '....#########.ooo.#########....',
    '......########ooo########......',
    '.............ooooo.............',
    '.............ooooo.............',
    '........######ooo######........',
    '......########ooo########......',
    '.....########.ooo.########.....',
    '....#######...sss...#######....',
    '.....####.....ooo.....####.....',
    '..............oo...............',
    '..............sss..............',
    '...............o...............',
    '...............o...............',
    '...............s...............',
    '...............o...............',
    '...............o...............',
    '...............s...............',
    '...............o...............',
    '...............o...............',
  ]],
  ['In flight', 'The same see-through wings as now, flying up to the right', 3, [
    '..........##...................',
    '..........#+#..................',
    '...........#+#.................',
    '...........#++#................',
    '............#+#................',
    '............#++#...............',
    '.............#+#..oo...........',
    '.....######...#+#oooo..........',
    '.....#+++++#...##ooooo.........',
    '......#+++++#...oooooo.........',
    '.......##++++#.oooooo..........',
    '.........#####ooooo##..........',
    '..............oooo.#+##........',
    '..............ooo...#++##......',
    '............oss.##...#+++#.....',
    '............oo..#+#...##++#....',
    '...........soo..#++#....##+#...',
    '..........oo....#+++#.....##...',
    '.........so.....#+++#..........',
    '........oo.......#++#..........',
    '.......so........#++#..........',
    '......os..........#+#..........',
    '......o............##..........',
  ]],
]

const host = document.querySelector('section')!
figure(host, 'Now', 'In the game', 'See-through wings, seen from above', () => {}, { shop: false, view: VIEW })
ART.forEach(([name, say, top, rows], n) => figure(host, n + 1, name, say, (g, mx, my) => {
  const hot = Math.hypot(mx - CX, my - CY) < R + 1
  disc(g, CX, CY, R, hot ? UI.gold : UI.line)
  rows.forEach((row, j) => [...row].forEach((ch, i) => {
    g.fillStyle = INK[ch]?.[+hot]
    if (ch !== '.') g.fillRect(CX + i - 15, CY + top + j - 15, 1, 1)
  }))
  if (hot) note(g, TIP, CX - R, CY - R - 4, false, true)
}, { shop: false, lair: false, view: VIEW }))
