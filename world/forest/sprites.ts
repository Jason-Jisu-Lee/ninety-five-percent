import { ctx, mk } from '../../core/canvas'
import { once } from '../../core/once'
import { FOREST as C } from '../../data/palette'

const TUFT = [
  ['...#...', '#..#..#', '.#.#.#.', '..###..'],
  ['#.#', '.#.'],
  ['.#...', '.#.#.', '..##.', '..#..'],
]
const FLOWER = ['.ppp.', 'ppcpp', 'pcccp', 'ppcpp', '.ppp.', '.sss.'], BUD = ['.p.', 'pcp', '.p.', '.s.']
const KIND = { white: [C.white, C.yellow], yellow: [C.yellow, C.seed], pink: [C.pink, C.white] }
export type Kind = keyof typeof KIND

function stamp(shape: string[], pad: number, ink: (ch: string) => string | false, shift = (_r: number) => 0) {
  const c = mk(shape[0].length + pad, shape.length), g = ctx(c)
  shape.forEach((row, r) => [...row].forEach((ch, i) => {
    const col = ink(ch)
    if (!col) return
    g.fillStyle = col
    g.fillRect(i + shift(r), r, 1, 1)
  }))
  return c
}

export const tufts = once(() => TUFT.map(s => [C.g3, C.g0].map(col => [0, 1, 2].map(pose =>
  stamp(s, 2, ch => ch === '#' && col, r => Math.min(s.length - 1, Math.round(pose * (s.length - 1 - r) / (s.length - 1))))))))

export const flowers = once(() => Object.fromEntries(Object.entries(KIND).map(([k, [petal, heart]]) =>
  [k, [FLOWER, BUD].map(s => stamp(s, 0, ch => ch === 'p' ? petal : ch === 'c' ? heart : ch === 's' && C.g0))])) as Record<Kind, HTMLCanvasElement[]>)

export const tuftHeight = (v: number) => TUFT[v].length
