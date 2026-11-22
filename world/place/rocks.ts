import type { Board, Key } from './board'

export const STONE = [[
  '........bbbbbbbbb.........',
  '.....bbbccccccccbbb.......',
  '...bbccccddddcccccbbb.....',
  '..bccccdddddccccccccbb....',
  '.bcccccddccccccccccccbb...',
  '.bccccccccccccccccccbbba..',
  'bccccccccccccccccccbbbbba.',
  'bcccccccccccccccccbbbbbba.',
  'bbccccccccccccccbbbbbbbbaa',
  'bbbccccccccccbbbbbbbbbbbaa',
  '.bbbbbcccbbbbbbbbbbbbbbaaa',
  '.abbbbbbbbbbbbbbbbbbbbaaa.',
  '..aabbbbbbbbbbbbbbbbaaaa..',
  '...aaaabbbbbbbbbbaaaaa....',
  '.....aaaaaaaaaaaaaaa......',
], [
  '....bbbbbb.....',
  '..bbccddccbb...',
  '.bcccddccccbb..',
  'bccccccccccbbb.',
  'bcccccccccbbbba',
  'bbccccccbbbbbba',
  '.bbbbbbbbbbbbaa',
  '.abbbbbbbbbaaa.',
  '..aaaaaaaaaa...',
], [
  '.bccb..',
  'bcdccb.',
  'bcccbba',
  '.bbbbaa',
  '..aaa..',
]]

export const SNAG = [
  '..........e.........',
  '.........ef....e....',
  '.........eg...ef....',
  '...e.....eg...eg....',
  '...ef....egf.efg....',
  '....ef...egf.eg.....',
  '....egf..eggeff.....',
  '.....egf.egggf......',
  '......egfegggf......',
  '.......egggggf......',
  '.......efggzgf......',
  '.......efggzgf......',
  '.......efggzgf......',
  '.......efgggff......',
  '.......efggzgf......',
  '.......efggzgf......',
  '......eefgggfff.....',
  '.....eefggzggffe....',
  '....eeffggggggffe...',
  '...eeefffgggfffeee..',
]

const BARK = 'zggfffee'

export function log(b: Board, x: number, y: number, len: number, every: number, k: Key) {
  const at = (i: number) => y + (every ? Math.floor(i / every) : 0)
  for (let i = 0; i < len; i++) for (let j = 0; j < 8; j++) b.dim(x + i + 3, at(i) + j + 4)
  for (let i = 0; i < len; i++) for (let j = 0; j < 8; j++) {
    const end = i < 2 || i > len - 3, tip = i === 0 || i === len - 1
    if (tip && (j < 2 || j > 5) || end && (j < 1 || j > 6)) continue
    b.set(x + i, at(i) + j, k[i > len - 4 ? j > 1 && j < 6 && i < len - 1 ? j > 2 && j < 5 && i === len - 3 ? 'e' : 'z' : 'g' : (i * 7 + j * 3) % 23 < 3 && j > 2 && j < 6 ? 'e' : j < 2 && i > len * .45 && i < len * .45 + 14 && (i + j) % 5 ? j ? '6' : '7' : BARK[j]])
  }
  for (let j = 1, s = Math.round(len * .28); j < 7; j++) for (const w of [0, 1]) b.set(x + s + j + w, at(s) - j + 1, k[w ? 'f' : 'g'])
}
