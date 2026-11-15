import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H } from '../../data/look/screen'
import { box } from '../parts/panel'
import { text } from '../text/text'

export type Tool = [label: () => string, run: () => void]

const X = 8, Y = H - 21, BW = 34, P = 37

export function devConsole(tools: Tool[]) {
  let hot = -1
  const at = (x: number, y: number) => y >= Y && y < Y + 13 && x >= X && x < X + P * tools.length && (x - X) % P < BW ? (x - X) / P | 0 : -1
  return {
    hover: (x: number, y: number) => (hot = at(x, y)) >= 0,
    click(x: number, y: number) {
      tools[at(x, y)]?.[1]()
      return at(x, y) >= 0
    },
    draw(g: Ctx) {
      tools.forEach(([label], i) => {
        box(g, X + i * P, Y, BW, 13, i === hot ? UI.accent : UI.dim, UI.panel)
        text(g, label(), X + i * P + BW / 2, Y + 10, UI.text, 'c')
      })
    },
  }
}
