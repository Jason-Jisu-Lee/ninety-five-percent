import type { Ctx } from '../../core/screen/canvas'
import { FOREST as C, UI } from '../../data/look/palette'
import { drop } from '../parts/icons'
import { text } from '../text/text'

export function blood(g: Ctx, n: number) {
  for (let i = 0; i < 9; i++) drop(g, 15 + i % 3, 14 + (i / 3 | 0), UI.panel)
  drop(g, 16, 15, C.red)
  text(g, String(Math.floor(n)), 24, 19, UI.text, undefined, UI.panel)
}
