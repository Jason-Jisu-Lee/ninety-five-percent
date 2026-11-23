import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { mixer } from '../parts/mixer'
import { box } from '../parts/panel'

const PAD = 7, X = W - 4 - mixer.w - PAD * 2, Y = 28, REACH = 3

export function soundBox(icon: (x: number, y: number) => boolean) {
  let open = false
  const inside = (x: number, y: number) => x >= X && x < X + mixer.w + PAD * 2 && y >= Y - REACH && y < Y + mixer.h + PAD * 2
  return {
    open: () => open,
    hover(x: number, y: number) {
      open = icon(x, y) || open && inside(x, y)
      return open && mixer.on(x, y, X + PAD, Y + PAD)
    },
    click(x: number, y: number) {
      if (!open || !inside(x, y)) return false
      mixer.click(x, y, X + PAD, Y + PAD)
      return true
    },
    draw(g: Ctx) {
      if (!open) return
      box(g, X, Y, mixer.w + PAD * 2, mixer.h + PAD * 2, UI.border, UI.panel)
      mixer.draw(g, X + PAD, Y + PAD)
    },
  }
}
