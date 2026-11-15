import { ctx, mk, type Ctx } from '../core/canvas'
import { dissolve } from '../core/dissolve'
import { H, W } from '../data/screen'
import { logo } from './logo'
import { menu } from './menu'

export function front(start: () => void) {
  const layer = ctx(mk(W, H)), buttons = menu([{ label: 'Start', run: start }, { label: 'Settings', run() {} }, { label: 'Exit', run: () => close() }], W - 118, H - 16)
  return {
    ...buttons,
    draw(g: Ctx, level: number) {
      layer.clearRect(0, 0, W, H)
      layer.drawImage(logo(), 20, 18)
      buttons.draw(layer)
      dissolve(g, layer.canvas, 0, 0, level)
    },
  }
}
