import { ctx, exact, mk, type Ctx } from '../../core/screen/canvas'
import { ORB } from '../../data/look/palette'

const BEAD = ['.###.', '#o###', '#####', '###d#', '.###.']

const ART = {
  pause: ['', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.'],
  play: ['..#', '..##', '..####', '..#####', '..######', '..#####', '..####', '..##', '..#'],
  note: ['....###', '....####', '....#..##', '....#...#', '....#', '....#', '.####', '#####', '.###'],
  slash: ['#', '##', '.##', '..##', '...##', '....##', '.....##', '......##', '.......##'],
  x: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  lock: ['..###..', '.#...#.', '.#...#.', '#######', '###.###', '###.###', '#######'],
  tick: ['......#', '.....##', '#...##.', '##.##..', '.###...', '..#....'],
}
const made = new Map<string, HTMLCanvasElement>(), PAD = 4, SOLID = /^(#[0-9a-f]{6}|)$/i

function stamp(g: Ctx, key: string, x: number, y: number, cols: string[], paint: (c: Ctx, x: number, y: number) => void) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || !cols.every(c => SOLID.test(c)) || !exact(g)) return paint(g, x, y)
  let art = made.get(key)
  if (!art) {
    made.set(key, art = mk(16, 16))
    paint(ctx(art), PAD, PAD)
  }
  g.drawImage(art, x - PAD, y - PAD)
}

function figure(g: Ctx, name: keyof typeof ART, x: number, y: number, col: string, edge = '') {
  if (edge) for (let n = 0; n < 9; n++) figure(g, name, x + n % 3 - 1, y + (n / 3 | 0) - 1, edge)
  g.fillStyle = col
  ART[name].forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] === '#') g.fillRect(x + i, y + j, 1, 1)
  })
}

function bead(g: Ctx, x: number, y: number, flat = '', edge = '') {
  if (edge) for (let n = 0; n < 9; n++) bead(g, x + n % 3 - 1, y + (n / 3 | 0) - 1, edge)
  BEAD.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] !== '.') {
      g.fillStyle = flat || ORB[row[i]]
      g.fillRect(x - 2 + i, y - 2 + j, 1, 1)
    }
  })
}

export const icon = (g: Ctx, name: keyof typeof ART, x: number, y: number, col: string, edge = '') => stamp(g, `${name} ${col} ${edge}`, x, y, [col, edge], (c, x, y) => figure(c, name, x, y, col, edge))

export const orb = (g: Ctx, x: number, y: number, flat = '', edge = '') => stamp(g, `orb ${flat} ${edge}`, x, y, [flat, edge, ...Object.values(ORB)], (c, x, y) => bead(c, x, y, flat, edge))

export function gem(g: Ctx, x: number, y: number, col: string) {
  g.fillStyle = col
  for (let i = -2; i <= 2; i++) g.fillRect(x - 2 + Math.abs(i), y + i, 5 - 2 * Math.abs(i), 1)
}
