import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { panel } from './panel'
import { text } from '../text/text'

type Item = { label: string; run(): void }

export function menu(items: Item[], x: number, bottom: number, k = 1, w = 96, h = 22, pitch = 28) {
  let sel = 0
  const top = bottom - (h + (items.length - 1) * pitch) * k
  const hover = (px: number, py: number) => {
    const i = px < x || px >= x + w * k ? -1 : items.findIndex((_, i) => py >= top + i * pitch * k && py < top + (i * pitch + h) * k)
    if (i >= 0) sel = i
    return i >= 0
  }
  return {
    top,
    hover,
    focus(i: number) {
      sel = i
    },
    click(px: number, py: number) {
      if (hover(px, py)) items[sel].run()
    },
    key(k: string) {
      const d = k === 'ArrowDown' || k === 's' ? 1 : k === 'ArrowUp' || k === 'w' ? -1 : 0
      if (d) sel = (sel + d + items.length) % items.length
      else if (k === 'Enter' || k === ' ') items[sel].run()
      return !!d || k === 'Enter' || k === ' '
    },
    draw(g: Ctx) {
      g.save()
      g.imageSmoothingEnabled = false
      g.translate(x, top)
      g.scale(k, k)
      items.forEach((it, i) => {
        panel(g, 0, i * pitch, w, h, i === sel ? UI.accent : UI.border, UI.panel)
        text(g, it.label, w / 2, i * pitch + 15, i === sel ? UI.accent : UI.text, 'c')
      })
      g.restore()
    },
  }
}
