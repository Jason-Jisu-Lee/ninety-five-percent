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

const POINTER = ['#', '##', '#o#', '#oo#', '#ooo#', '#oooo#', '#ooooo#', '#oooooo#', '#ooooo###', '#oo#oo#', '#o#.#oo#', '##..#oo#', '.....##']
const MOUSE = ['..#####', '.#oo#oo#', '#ooo#ooo#', '#ooo#ooo#', '#########', '#ooooooo#', '#ooooooo#', '#ooooooo#', '#ooooooo#', '.#ooooo#', '..#####']
const DOWN = ['#...#', '.#.#.', '..#..'], NEXT = ['#', '.#', '..#', '.#', '#'], FLY = ['o.#.o', '.o#o.', '..#']
const at = (p: Prey) => [Math.round(p.x), Math.round(p.y - p.h * .7)]
const close = (c: number, by: number) => Math.round(by * (1 - Math.min(1, c / .4)) ** 2)

function keyAt(p: Prey) {
  const w = Math.max(width(PREY[p.kind].name), 22) + 10, x = clamp(Math.round(p.x - w / 2), 2, W - w - 2), py = at(p)[1], r = span(p)
  return [x + w + 13 < W ? x + w + 2 : x - 13, Math.min(H - 21, py - r - 23 < 28 ? py + r + 5 : py - r - 23) + 3]
}

function cap(g: Ctx, x: number, y: number, down: boolean, top = UI.border, side = UI.dim) {
  const face = down ? '#ffffff' : top, d = down ? 2 : 0
  box(g, x, y, 11, 13, side, side)
  box(g, x, y + d, 11, 11, face, face)
  text(g, 'A', x + 3, y + 9 + d, UI.panel)
}

function tap(g: Ctx, s: See) {
  if (s.hot && !s.marked) cap(g, keyAt(s.hot)[0], keyAt(s.hot)[1], s.t % .7 < .16)
}

export const HINTS: { name: string; note: string; draw(g: Ctx, s: See): void }[] = [
  {
    name: 'Ghost pointer',
    note: 'A pale pointer shows the move: it glides onto a fruit fly and an A key taps beside it. Once the real pointer is on a fly, the A key on the name box taps',
    draw(g, s) {
      const c = s.t % 2.8, e = 1 - (1 - Math.min(1, c / .9)) ** 3
      tap(g, s)
      if (s.hot || s.marked || !s.aim || c >= 2.3) return
      const [x, y] = at(s.aim), px = Math.round(x + 34 * (1 - e)), py = Math.round(y + 26 * (1 - e)), beat = (c - .9) % .55
      g.globalAlpha = .85
      if (c >= .9) {
        marks(g, x, y, span(s.aim), UI.text)
        cap(g, px + 12, py + 8, beat > .3 && beat < .46)
      }
      stamp(g, POINTER, px, py, { '#': UI.panel, o: UI.text })
      g.globalAlpha = 1
    },
  },
  {
    name: 'Marked fly',
    note: 'Pale marks close in on the nearest fruit fly, with a mouse above it. Once the real pointer is on a fly, the A key on the name box taps',
    draw(g, s) {
      const c = s.t % 1.2
      tap(g, s)
      if (s.hot || s.marked || !s.aim) return
      const [x, y] = at(s.aim), r = span(s.aim), up = y - r - 26 > 30, bob = +(c > .6)
      marks(g, x, y, r + close(c, 9), UI.text)
      stamp(g, up ? DOWN : [...DOWN].reverse(), x - 2, up ? y - r - 8 : y + r + 6, { '#': UI.text }, UI.panel)
      stamp(g, MOUSE, x - 4, up ? y - r - 22 - bob : y + r + 12 + bob, { '#': UI.text, o: UI.panel }, UI.panel)
    },
  },
  {
    name: 'Bottom prompt',
    note: 'A small strip at the bottom centre: mouse, target, A key. The step the player is on is lit. The A key on the name box taps too',
    draw(g, s) {
      const two = !!s.hot || s.marked, ink = two ? UI.faint : UI.text, c = s.t % 1.2, x = W / 2 - 36, y = H - 30
      tap(g, s)
      box(g, x, y, 72, 21, UI.border, UI.panel)
      stamp(g, MOUSE, x + 7, y + 5, { '#': ink })
      stamp(g, NEXT, x + 20, y + 8, { '#': UI.faint })
      marks(g, x + 33, y + 10, two ? 5 : 5 + close(c, 3), two ? UI.faint : UI.foe)
      stamp(g, FLY, x + 31, y + 9, { '#': ink, o: two ? UI.faint : UI.ally })
      stamp(g, NEXT, x + 45, y + 8, { '#': UI.faint })
      if (two) cap(g, x + 53, y + 4, !s.marked && s.t % .7 < .16)
      else cap(g, x + 53, y + 4, false, UI.faint, UI.line)
    },
  },
]
