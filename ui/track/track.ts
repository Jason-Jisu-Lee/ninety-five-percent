import { listen, playing } from '../../audio/player/music'
import { mask, shade } from '../../core/draw/dissolve'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { smooth, spot } from '../nav/smooth'
import { text, width } from '../text/text'
import { bars, sway } from './bars'

const PAD = 6, TOP = 4, TALL = 25, sharp = ctx(mk(1, 1)), cut = ctx(mk(W, TALL))
let x = -1

export function tick(dt: number) {
  listen(dt)
  sway(dt)
}

export function now(g: Ctx, right: number) {
  const name = playing()
  x = name ? right - width(name) - 18 : -1
  text(g, name, right, 20, UI.text, 'r', UI.panel)
}

export function glow(out: Ctx, k: number, level: number) {
  const c = sharp.canvas, keep = Math.round(level * 16), dark = shade.n, left = Math.min(x < 0 ? W : x - PAD, spot.x - 2), wide = W - left
  shade.n = 0
  if (!keep || dark > 15) return
  c.width = wide * k
  c.height = TALL * k
  sharp.setTransform(k, 0, 0, k, -left * k, -TOP * k)
  if (x >= 0) bars(sharp, x, k)
  sharp.shadowBlur = 0
  smooth(sharp)
  sharp.setTransform(1, 0, 0, 1, 0, 0)
  sharp.imageSmoothingEnabled = false
  for (const [n, how] of [[keep % 16, 'destination-in'], [dark, 'destination-out']] as const) {
    if (!n) continue
    cut.clearRect(0, 0, W, TALL)
    cut.setTransform(1, 0, 0, 1, -left, -TOP)
    cut.fillStyle = mask(n)
    cut.fillRect(left, TOP, wide, TALL)
    cut.setTransform(1, 0, 0, 1, 0, 0)
    sharp.globalCompositeOperation = how
    sharp.drawImage(cut.canvas, 0, 0, wide, TALL, 0, 0, c.width, c.height)
  }
  out.drawImage(c, left * k, TOP * k)
}
