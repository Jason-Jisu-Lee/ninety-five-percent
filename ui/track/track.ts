import { listen, playing } from '../../audio/player/music'
import { mask, shade } from '../../core/draw/dissolve'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { text, width } from '../text/text'
import { bars, sway, WIDE } from './bars'

const PAD = 6, TOP = 4, TALL = 25, FULL = Math.ceil(WIDE) + PAD * 2, sharp = ctx(mk(1, 1)), cut = ctx(mk(FULL, TALL))
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
  const c = sharp.canvas, keep = Math.round(level * 16), dark = shade.n
  shade.n = 0
  if (x < 0 || !keep || dark > 15) return
  c.width = FULL * k
  c.height = TALL * k
  sharp.setTransform(k, 0, 0, k, (PAD - x) * k, -TOP * k)
  bars(sharp, x, k)
  sharp.setTransform(1, 0, 0, 1, 0, 0)
  sharp.shadowBlur = 0
  sharp.imageSmoothingEnabled = false
  for (const [n, how] of [[keep % 16, 'destination-in'], [dark, 'destination-out']] as const) {
    if (!n) continue
    cut.clearRect(0, 0, FULL, TALL)
    cut.setTransform(1, 0, 0, 1, PAD - x, -TOP)
    cut.fillStyle = mask(n)
    cut.fillRect(x - PAD, TOP, FULL, TALL)
    cut.setTransform(1, 0, 0, 1, 0, 0)
    sharp.globalCompositeOperation = how
    sharp.drawImage(cut.canvas, 0, 0, c.width, c.height)
  }
  out.drawImage(c, (x - PAD) * k, TOP * k)
}
