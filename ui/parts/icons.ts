import type { Ctx } from '../../core/screen/canvas'
import { ORB } from '../../data/look/palette'

const BEAD = ['.###.', '#o###', '#####', '###d#', '.###.']

const ART = {
  pause: ['', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.'],
  play: ['..#', '..##', '..####', '..#####', '..######', '..#####', '..####', '..##', '..#'],
  note: ['....###', '....####', '....#..##', '....#...#', '....#', '....#', '.####', '#####', '.###'],
  slash: ['#', '##', '.##', '..##', '...##', '....##', '.....##', '......##', '.......##'],
  x: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  tick: ['......#', '.....##', '#...##.', '##.##..', '.###...', '..#....'],
}

export function icon(g: Ctx, name: keyof typeof ART, x: number, y: number, col: string, edge = '') {
  if (edge) for (let n = 0; n < 9; n++) icon(g, name, x + n % 3 - 1, y + (n / 3 | 0) - 1, edge)
  g.fillStyle = col
  ART[name].forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] === '#') g.fillRect(x + i, y + j, 1, 1)
  })
}

export function orb(g: Ctx, x: number, y: number, flat = '', edge = '') {
  if (edge) for (let n = 0; n < 9; n++) orb(g, x + n % 3 - 1, y + (n / 3 | 0) - 1, edge)
  BEAD.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] !== '.') {
      g.fillStyle = flat || ORB[row[i]]
      g.fillRect(x - 2 + i, y - 2 + j, 1, 1)
    }
  })
}

export function gem(g: Ctx, x: number, y: number, col: string) {
  g.fillStyle = col
  for (let i = -2; i <= 2; i++) g.fillRect(x - 2 + Math.abs(i), y + i, 5 - 2 * Math.abs(i), 1)
}
