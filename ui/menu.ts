import type { Ctx } from '../core/canvas'
import { UI } from '../data/palette'
import { panel } from './panel'
import { text } from './text'

export type Item = { label: string; run(): void }

export function menu(items: Item[], x: number, bottom: number, w = 96, h = 22, pitch = 28) {
  let sel = 0
  const top = bottom - h - (items.length - 1) * pitch
  const hover = (px: number, py: number) => {
    const i = px < x || px >= x + w ? -1 : items.findIndex((_, i) => py >= top + i * pitch && py < top + i * pitch + h)
    if (i >= 0) sel = i
    return i >= 0
  }
  return {
    hover,
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
      items.forEach((it, i) => {
        const y = top + i * pitch
        panel(g, x, y, w, h, i === sel ? UI.accent : UI.border, UI.panel)
        text(g, it.label, x + w / 2, y + 15, 11, i === sel ? UI.accent : UI.text, 'c')
      })
    },
  }
}
