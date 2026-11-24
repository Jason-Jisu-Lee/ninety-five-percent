import { UI } from '../../data/look/palette'

export type Style = { name: string; note: string; art: string[]; inks: Record<string, string>; hot: number[]; shade?: boolean }

const ARROW = ['#', '##', '#o#', '#oo#', '#ooo#', '#oooo#', '#ooooo#', '#ooo####', '#o#oo#', '##.#oo#', '....##']
const DART = ['#', '##', '#o#', '#oo#', '#ooo#', '#oooo#', '#ooooo#', '#oooooo#', '#ooo####', '#oo#', '#o#', '##']
const HAND = ['...##', '..#oo#', '..#oo#', '..#oo###', '..#oo#oo##', '###oo#oo#o#', '#o#ooooooo#', '#ooooooooo#', '.#oooooooo#', '..#ooooooo#', '..#oooooo#', '...######']
const light = { '#': UI.panel, o: UI.text }, MID = [4.5, 4.5], line = (n: number, f: (i: number) => number[]) => Array.from({ length: n }, (_, i) => f(i))

function rimmed(dots: number[][]) {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill('.'))
  for (const [x, y] of dots) for (let j = -1; j < 2; j++) for (let i = -1; i < 2; i++) if (rows[y + j]?.[x + i]) rows[y + j][x + i] = '#'
  for (const [x, y] of dots) rows[y][x] = 'o'
  return rows.map(r => r.join(''))
}

const CROSS = rimmed([[4, 4], ...[1, 6].flatMap(a => line(2, i => [4, a + i])), ...[1, 6].flatMap(a => line(2, i => [a + i, 4]))])
const RING = rimmed([[4, 4], ...line(81, i => [i % 9, i / 9 | 0]).filter(([x, y]) => Math.round(Math.hypot(x - 4, y - 4)) === 3)])
const MARKS = rimmed([[4, 4], ...[1, 7].flatMap(y => [1, 6].flatMap(a => line(2, i => [a + i, y]))), ...[1, 7].flatMap(x => [1, 6].flatMap(a => line(2, i => [x, a + i])))])

export const STYLES: Style[] = [
  { name: 'Arrow', note: 'The standard arrow in the game\'s cream, with a dark edge', art: ARROW, inks: light, hot: [0, 0] },
  { name: 'Dark arrow', note: 'The same arrow, dark with a cream edge', art: ARROW, inks: { '#': UI.text, o: UI.panel }, hot: [0, 0] },
  { name: 'Dart', note: 'An arrow with no tail', art: DART, inks: light, hot: [0, 0] },
  { name: 'Shadow arrow', note: 'Cream with a hard shadow and no edge, like the title', art: ARROW, inks: { '#': UI.text, o: UI.text }, hot: [0, 0], shade: true },
  { name: 'Hand', note: 'A pointing hand. The fingertip is the point', art: HAND, inks: light, hot: [3.5, 0] },
  { name: 'Crosshair', note: 'A plus with a dot. The middle is the point', art: CROSS, inks: light, hot: MID },
  { name: 'Ring', note: 'A ring with a dot. The middle is the point', art: RING, inks: light, hot: MID },
  { name: 'Corner marks', note: 'The game\'s lock marks as a pointer. The middle is the point', art: MARKS, inks: light, hot: MID },
]
