import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H } from '../../data/look/screen'
import { box } from '../parts/panel'
import { text, width } from '../text/text'

export type Tool = [label: () => string, run: () => void]

const X = 8, Y = H - 21, GAP = 3

export function devConsole(tools: Tool[]) {
  let hot = -1
  const spots = () => {
    let x = X
    return tools.map(([label]) => {
      const w = Math.max(34, width(label()) + 10)
      return [(x += w + GAP) - w - GAP, w]
    })
  }
  const at = (x: number, y: number) => y >= Y && y < Y + 13 ? spots().findIndex(([left, w]) => x >= left && x < left + w) : -1
  return {
    hover: (x: number, y: number) => (hot = at(x, y)) >= 0,
    click(x: number, y: number) {
      tools[at(x, y)]?.[1]()
      return at(x, y) >= 0
    },
    draw(g: Ctx) {
      spots().forEach(([left, w], i) => {
        box(g, left, Y, w, 13, i === hot ? UI.accent : UI.dim, UI.panel)
        text(g, tools[i][0](), left + w / 2, Y + 10, UI.text, 'c')
      })
    },
  }
}
