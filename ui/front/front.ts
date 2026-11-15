import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { dissolve } from '../../core/draw/dissolve'
import { save } from '../../core/save/save'
import { H, W } from '../../data/look/screen'
import { logo } from './logo'
import { menu } from '../parts/menu'

export function front(start: () => void, options: () => void) {
  const layer = ctx(mk(W, H)), go = { run: start, get label() { return save.started ? 'Continue' : 'Start' } }
  const buttons = menu([go, { label: 'Settings', run: options }, { label: 'Exit', run: () => close() }], W - 118, H - 16)
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
