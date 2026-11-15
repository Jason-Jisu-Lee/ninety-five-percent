import type { Ctx } from '../core/canvas'

const ART = {
  pause: ['', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.'],
  play: ['..#', '..##', '..####', '..#####', '..######', '..#####', '..####', '..##', '..#'],
  note: ['..#######', '..#######', '..#.....#', '..#.....#', '..#.....#', '.##....##', '###...###', '###...###', '.#.....#.'],
  slash: ['#', '##', '.##', '..##', '...##', '....##', '.....##', '......##', '.......##'],
  gear: ['...###...', '.#.###.#.', '..#####..', '###...###', '###...###', '###...###', '..#####..', '.#.###.#.', '...###...'],
  x: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  down: ['#####', '.###.', '..#..'],
  right: ['#', '##', '###', '##', '#'],
}

export function icon(g: Ctx, name: keyof typeof ART, x: number, y: number, col: string) {
  g.fillStyle = col
  ART[name].forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] === '#') g.fillRect(x + i, y + j, 1, 1)
  })
}

export function gem(g: Ctx, x: number, y: number, col: string) {
  g.fillStyle = col
  for (let i = -2; i <= 2; i++) g.fillRect(x - 2 + Math.abs(i), y + i, 5 - 2 * Math.abs(i), 1)
}
