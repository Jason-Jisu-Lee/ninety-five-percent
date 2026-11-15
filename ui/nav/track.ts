import { beat, playing } from '../../audio/player/music'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { text, width } from '../text/text'

const BINS = [0, 1, 2, 4, 7]

export function now(g: Ctx, right: number, y: number) {
  const name = playing()
  if (!name) return
  const x = right - width(name) - 20, bins = beat()
  text(g, name, right, y, UI.text, 'r', UI.panel)
  BINS.forEach((b, i) => {
    const h = 1 + (bins[b] / 255) ** 2 * 8 | 0
    g.fillStyle = UI.panel
    g.fillRect(x + i * 3 - 1, y - h - 1, 4, h + 2)
    g.fillStyle = UI.accent
    g.fillRect(x + i * 3, y - h, 2, h)
  })
}
