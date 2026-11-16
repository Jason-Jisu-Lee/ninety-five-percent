import type { Ctx } from '../../core/screen/canvas'

const ART = {
  pause: ['', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.'],
  play: ['..#', '..##', '..####', '..#####', '..######', '..#####', '..####', '..##', '..#'],
  note: ['....###', '....####', '....#..##', '....#...#', '....#', '....#', '.####', '#####', '.###'],
  slash: ['#', '##', '.##', '..##', '...##', '....##', '.....##', '......##', '.......##'],
  x: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  down: ['#####', '.###.', '..#..'],
  right: ['#', '##', '###', '##', '#'],
}

export function icon(g: Ctx, name: keyof typeof ART, x: number, y: number, col: string, edge = '') {
  if (edge) for (let n = 0; n < 9; n++) icon(g, name, x + n % 3 - 1, y + (n / 3 | 0) - 1, edge)
  g.fillStyle = col
  ART[name].forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] === '#') g.fillRect(x + i, y + j, 1, 1)
  })
}

export function drop(g: Ctx, x: number, y: number, col: string) {
  g.fillStyle = col
  ;[1, 1, 3, 3, 5, 5, 3].forEach((w, j) => g.fillRect(x - (w >> 1), y - 3 + j, w, 1))
}

export function gem(g: Ctx, x: number, y: number, col: string) {
  g.fillStyle = col
  for (let i = -2; i <= 2; i++) g.fillRect(x - 2 + Math.abs(i), y + i, 5 - 2 * Math.abs(i), 1)
}
