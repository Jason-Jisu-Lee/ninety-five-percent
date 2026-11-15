import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { text, width } from '../text/text'
import { box } from './panel'

export function note(g: Ctx, lines: string[], x: number, y: number, right = false, up = false) {
  const w = Math.max(...lines.map(l => width(l))) + 10, h = lines.length * 11 + 7, left = right ? x - w : x, top = up ? y - h : y
  box(g, left, top, w, h, UI.border, UI.panel)
  lines.forEach((l, i) => text(g, l, left + 5, top + 12 + i * 11, i ? UI.accent : UI.text))
}
