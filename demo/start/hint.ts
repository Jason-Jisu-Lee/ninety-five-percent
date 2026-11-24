import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { PREY } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { marks } from '../../ui/parts/marks'
import { box } from '../../ui/parts/panel'
import { text, width } from '../../ui/text/text'
import type { Prey } from '../../world/creatures/prey'
import { span } from '../../world/creatures/span'
import { stamp } from './stamp'

export type See = { t: number; aim: Prey | null; hot: Prey | null; marked: boolean }

const DOWN = ['#...#', '.#.#.', '..#..']
const at = (p: Prey) => [Math.round(p.x), Math.round(p.y - p.h * .7)]

function keyAt(p: Prey) {
  const w = Math.max(width(PREY[p.kind].name), 22) + 10, x = clamp(Math.round(p.x - w / 2), 2, W - w - 2), py = at(p)[1], r = span(p)
  return [x + w + 13 < W ? x + w + 2 : x - 13, Math.min(H - 21, py - r - 23 < 28 ? py + r + 5 : py - r - 23) + 3]
}

function cap(g: Ctx, x: number, y: number, down: boolean) {
  const face = down ? '#ffffff' : UI.border, d = down ? 2 : 0
  box(g, x, y, 11, 13, UI.dim, UI.dim)
  box(g, x, y + d, 11, 11, face, face)
  text(g, 'A', x + 3, y + 9 + d, UI.panel)
}

export function hint(g: Ctx, s: See) {
  const c = s.t % 1.2
  if (s.hot && !s.marked) cap(g, keyAt(s.hot)[0], keyAt(s.hot)[1], s.t % .7 < .16)
  if (s.hot || s.marked || !s.aim) return
  const [x, y] = at(s.aim), r = span(s.aim), up = y - r - 28 > 30, bob = +(c > .6)
  marks(g, x, y, r + Math.round(9 * (1 - Math.min(1, c / .4)) ** 2), UI.text)
  stamp(g, up ? DOWN : [...DOWN].reverse(), x - 2, up ? y - r - 8 : y + r + 6, { '#': UI.text }, UI.panel)
  cap(g, x - 5, up ? y - r - 24 - bob : y + r + 12 + bob, false)
}
