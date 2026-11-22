import { silent } from '../../audio/player/music'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { dissolve, etch } from '../../core/draw/dissolve'
import { save } from '../../core/save/save'
import { H, W } from '../../data/look/screen'
import { nav } from '../nav/nav'
import { soundBox } from '../nav/sound'
import { menu } from '../parts/menu'
import { now } from '../track/track'
import { logo } from './logo'

const BW = 96, BH = 78, RIGHT = W - 22, BOTTOM = H - 16, GROW = 4 / 3

export function front(start: () => void, options: () => void) {
  const layer = ctx(mk(W, H)), plate = ctx(mk(BW, BH)), sharp = ctx(mk(1, 1)), go = { run: start, get label() { return save.started ? 'Continue' : 'Start' } }
  const buttons = menu([go, { label: 'Settings', run: options }, { label: 'Exit', run: () => close() }], 0, BH), levels = soundBox(), sound = nav([levels.flip])
  let s = GROW
  const local = (x: number, y: number): [number, number] => [(x - RIGHT) / s + BW, (y - BOTTOM) / s + BH]
  return {
    key: buttons.key,
    hover: (x: number, y: number) => [buttons.hover(...local(x, y)), sound.hover(x, y), levels.hover(x, y)].some(Boolean),
    click: (x: number, y: number) => levels.click(x, y) || sound.click(x, y) || buttons.click(...local(x, y)),
    draw(g: Ctx, level: number) {
      layer.clearRect(0, 0, W, H)
      layer.drawImage(logo(), 20, 18)
      sound.draw(layer, false, silent())
      now(layer, W - 31)
      levels.draw(layer)
      dissolve(g, layer.canvas, 0, 0, level)
    },
    over(out: Ctx, k: number, level: number, dark: number) {
      const m = Math.max(1, Math.round(k * GROW)), keep = Math.round(level * 16), c = sharp.canvas
      s = m / k
      const left = Math.floor(RIGHT - BW * s), top = Math.floor(BOTTOM - BH * s), wide = RIGHT - left, tall = BOTTOM - top
      if (!keep || dark > 15) return
      plate.clearRect(0, 0, BW, BH)
      buttons.draw(plate)
      c.width = wide * k
      c.height = tall * k
      sharp.imageSmoothingEnabled = false
      sharp.drawImage(plate.canvas, c.width - BW * m, c.height - BH * m, BW * m, BH * m)
      etch(sharp, left, top, wide, tall, keep, dark)
      out.drawImage(c, left * k, top * k)
    },
  }
}
