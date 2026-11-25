import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { details, DW, type Details } from './details'
import { icon } from './icons'
import { box } from './panel'

const X = W - DW >> 1

export function card<T>(make: (item: T) => Details) {
  let item: T | undefined, hot = false, top = 0, tall = 0, mx = -1, my = -1
  const onX = (x: number, y: number) => x >= X + DW - 19 && x < X + DW - 8 && y >= top + 6 && y < top + 17
  return {
    shown: () => item !== undefined,
    open: (v: T) => void (item = v),
    hover: (x: number, y: number) => ([mx, my] = [x, y], hot = onX(x, y)),
    click(x: number, y: number) {
      if (onX(x, y) || x < X || x >= X + DW || y < top || y >= top + tall) item = undefined
    },
    key(k: string) {
      if (k === 'Escape' || k === 'Enter' || k === ' ') item = undefined
      return true
    },
    draw(g: Ctx) {
      if (item === undefined) return
      ;[, top, tall] = details(g, make(item), t => [X, H - t >> 1], mx, my)
      box(g, X + DW - 19, top + 6, 11, 11, hot ? UI.accent : UI.border, UI.panel)
      icon(g, 'x', X + DW - 16, top + 9, UI.text)
    },
  }
}
