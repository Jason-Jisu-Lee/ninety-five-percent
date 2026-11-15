import { beat, playing } from '../../audio/player/music'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { meter } from '../../demo/meter'
import { text, width } from '../text/text'

export function now(g: Ctx, right: number, y: number) {
  const name = playing()
  if (!name) return
  text(g, name, right, y, UI.text, 'r', UI.panel)
  meter(g, right - width(name) - 7, y - 4, beat())
}
