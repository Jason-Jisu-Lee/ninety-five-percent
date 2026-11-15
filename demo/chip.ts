import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { box } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'

export function chip(g: Ctx, right: number, name: string, wide: number) {
  const full = width(name) + wide + 15
  box(g, right - full, 8, full, 17, UI.border, UI.panel)
  text(g, name, right - 5, 20, UI.text, 'r')
  return right - full + 5
}
