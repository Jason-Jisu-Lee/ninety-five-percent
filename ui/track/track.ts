import { listen, playing } from '../../audio/player/music'
import { etch } from '../../core/draw/dissolve'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { smooth, spot } from '../nav/smooth'
import { text, width } from '../text/text'
import { bars, sway } from './bars'

const PAD = 6, TOP = 4, TALL = 25, sharp = ctx(mk(1, 1))
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

export function glow(out: Ctx, k: number, level: number, dark: number) {
  const c = sharp.canvas, keep = Math.round(level * 16), left = Math.min(x < 0 ? W : x - PAD, spot.x - 2), wide = W - left
  if (!keep || dark > 15) return
  c.width = wide * k
  c.height = TALL * k
  sharp.setTransform(k, 0, 0, k, -left * k, -TOP * k)
  if (x >= 0) bars(sharp, x, k)
  sharp.shadowBlur = 0
  smooth(sharp)
  etch(sharp, left, TOP, wide, TALL, keep, dark)
  out.drawImage(c, left * k, TOP * k)
}
