import { bayer } from '../../core/draw/dither'
import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { marks } from '../../ui/parts/marks'
import { note } from '../../ui/parts/note'
import { text, width } from '../../ui/text/text'
import type { Perch } from '../../world/place/kit'

export type Now = { u: number; spots: Perch[]; near: Perch | null; x: number; y: number }

const FLASH = 1.2, LINES = ['Out of stamina', 'Resting at the closest rest spot'], HERE = ['Out of stamina', 'Resting here'], V = [[0, 0], [1, 1], [2, 2], [3, 1], [4, 0]]
const at = (p: Perch) => [Math.round(p.x), Math.round(p.y - p.h * .7)], wide = (lines: string[]) => Math.max(...lines.map(l => width(l))) + 10

function spot(g: Ctx, p: Perch) {
  marks(g, at(p)[0] + 1, at(p)[1] + 1, 7, UI.panel)
  marks(g, at(p)[0], at(p)[1], 7, UI.text)
}

function flash(g: Ctx, n: Now) {
  if (n.u < FLASH && n.u % .4 < .22) n.spots.forEach(p => spot(g, p))
  else if (n.u >= FLASH && n.near) spot(g, n.near)
}

function ring(g: Ctx, x: number, y: number, e: number) {
  const r = 3 + 9 * e
  for (const [col, o] of [[UI.panel, 1], [UI.text, 0]] as const) for (let a = 0; a < 6.283; a += .5 / r) {
    const px = Math.round(x + Math.cos(a) * r) + o, py = Math.round(y + Math.sin(a) * r) + o
    g.fillStyle = col
    if (1.6 - e * 1.6 > bayer(px, py)) g.fillRect(px, py, 1, 1)
  }
}

function chevron(g: Ctx, x: number, y: number) {
  for (let k = 0; k < 10; k++) {
    g.fillStyle = k < 9 ? UI.panel : UI.text
    for (const [i, j] of V) g.fillRect(x + i + (k < 9 ? k % 3 - 1 : 0), y + j + (k < 9 ? (k / 3 | 0) - 1 : 0), 1, 1)
  }
}

export const WAYS: { name: string; note: string; draw(g: Ctx, n: Now): void }[] = [
  {
    name: 'Marks only',
    note: 'No words. Every rest spot blinks three times with corner marks. Then only the closest one keeps its marks until the dragonfly lands',
    draw: flash,
  },
  {
    name: 'Rings and arrow',
    note: 'No words. A ring pulses out of every rest spot twice. Then a small arrow bobs over the closest one until the dragonfly lands',
    draw(g, n) {
      if (n.u < FLASH) for (const p of n.spots) ring(g, at(p)[0], at(p)[1], n.u % .6 / .6)
      else if (n.near) chevron(g, at(n.near)[0] - 2, at(n.near)[1] - 12 - +(n.u % .8 > .4))
    },
  },
  {
    name: 'Words on the dragonfly',
    note: 'The marks of 1, plus a small box that follows the dragonfly until it lands',
    draw(g, n) {
      const w = wide(LINES), up = n.y > 80
      flash(g, n)
      note(g, LINES, clamp(Math.round(n.x - w / 2), 2, W - w - 2), up ? n.y - 30 : n.y + 22, false, up)
    },
  },
  {
    name: 'Words on the rest spot',
    note: 'The marks of 1, plus a small box beside the closest rest spot until the dragonfly lands',
    draw(g, n) {
      flash(g, n)
      if (!n.near) return
      const [x, y] = at(n.near), w = wide(HERE), left = x + 12 + w > W - 2
      note(g, HERE, left ? x - 12 : x + 12, Math.max(30, y - 14), left)
    },
  },
  {
    name: 'Title across the screen',
    note: 'The marks of 1, plus a gold title in the place and style of Objective Complete, for 2.6 s',
    draw(g, n) {
      const half = width(LINES[0]) + 8
      flash(g, n)
      g.globalAlpha = clamp(Math.min(n.u / .25, (2.6 - n.u) / .4))
      text(g, LINES[0], W / 2, 72, UI.gold, 'c', UI.panel, 2)
      text(g, LINES[1], W / 2, 88, UI.text, 'c', UI.panel)
      for (const s of [-1, 1]) for (const [col, y] of [[UI.panel, 66], [UI.gold, 65]] as const) {
        g.fillStyle = col
        g.fillRect(W / 2 + s * half + (s < 0 ? -36 : 0), y, 36, 1)
      }
      g.globalAlpha = 1
    },
  },
]
