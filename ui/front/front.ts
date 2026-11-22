import { toggle } from '../../audio/player/music'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { dissolve } from '../../core/draw/dissolve'
import { save } from '../../core/save/save'
import { H, W } from '../../data/look/screen'
import { nav } from '../nav/nav'
import { menu } from '../parts/menu'
import { now } from '../track/track'
import { logo } from './logo'

export function front(start: () => void, options: () => void) {
  const layer = ctx(mk(W, H)), go = { run: start, get label() { return save.started ? 'Continue' : 'Start' } }
  const buttons = menu([go, { label: 'Settings', run: options }, { label: 'Exit', run: () => close() }], W - 214, H - 16, 2), sound = nav([toggle])
  return {
    key: buttons.key,
    hover: (x: number, y: number) => [buttons.hover(x, y), sound.hover(x, y)].some(Boolean),
    click: (x: number, y: number) => sound.click(x, y) || buttons.click(x, y),
    draw(g: Ctx, level: number) {
      layer.clearRect(0, 0, W, H)
      layer.drawImage(logo(), 20, 18)
      buttons.draw(layer)
      sound.draw(layer, false, !save.music)
      now(layer, W - 31)
      dissolve(g, layer.canvas, 0, 0, level)
    },
  }
}
