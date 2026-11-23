import { sound } from '../../audio/player/sound'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { panel } from './panel'
import { text } from '../text/text'

type Item = { label: string; run(): void }

export function menu(items: Item[], x: number, bottom: number, w = 96, h = 22, pitch = 28) {
  let sel = -1
  const top = bottom - h - (items.length - 1) * pitch
  const at = (px: number, py: number) => px < x || px >= x + w ? -1 : items.findIndex((_, i) => py >= top + i * pitch && py < top + i * pitch + h)
  const light = (i: number) => {
    if (i >= 0 && i !== sel) sound('hover')
    return (sel = i) >= 0
  }
  const pick = (i: number) => {
    sel = -1
    items[i]?.run()
  }
  return {
    top,
    hover: (px: number, py: number) => light(at(px, py)),
    focus(i: number) {
      sel = i
    },
    click: (px: number, py: number) => pick(at(px, py)),
    key(k: string) {
      const d = k === 'ArrowDown' || k === 's' ? 1 : k === 'ArrowUp' || k === 'w' ? -1 : 0
      if (d) light(sel < 0 ? d > 0 ? 0 : items.length - 1 : (sel + d + items.length) % items.length)
      else if (k === 'Enter' || k === ' ') pick(sel)
      return !!d || k === 'Enter' || k === ' '
    },
    draw(g: Ctx) {
      items.forEach((it, i) => {
        const y = top + i * pitch
        panel(g, x, y, w, h, i === sel ? UI.accent : UI.border, UI.panel)
        text(g, it.label, x + w / 2, y + 15, i === sel ? UI.accent : UI.text, 'c')
      })
    },
  }
}
