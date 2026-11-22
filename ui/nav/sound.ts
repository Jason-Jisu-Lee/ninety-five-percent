import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { mixer } from '../parts/mixer'
import { box } from '../parts/panel'

const PAD = 7, X = W - 4 - mixer.w - PAD * 2, Y = 28

export function soundBox() {
  let open = false
  return {
    flip() {
      open = !open
    },
    hover: (x: number, y: number) => open && mixer.on(x, y, X + PAD, Y + PAD),
    click(x: number, y: number) {
      if (!open) return false
      if (!mixer.click(x, y, X + PAD, Y + PAD)) open = false
      return true
    },
    draw(g: Ctx) {
      if (!open) return
      box(g, X, Y, mixer.w + PAD * 2, mixer.h + PAD * 2, UI.border, UI.panel)
      mixer.draw(g, X + PAD, Y + PAD)
    },
  }
}
