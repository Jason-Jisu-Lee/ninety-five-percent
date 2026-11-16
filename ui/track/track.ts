import { listen, playing } from '../../audio/player/music'
import { mask, shade } from '../../core/draw/dissolve'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { box } from '../parts/panel'
import { text, width } from '../text/text'
import { bars } from './bars'
import { grid } from './grid'

export type Display = { wide: number; step(dt: number): void; low?(g: Ctx, x: number): void; high?(g: Ctx, x: number, k: number): void }

const KINDS = [bars, grid], PAD = 6, TOP = 4, TALL = 25, sharp = ctx(mk(1, 1)), cut = ctx(mk(1, TALL))
let kind = 0, x = -1

export const pick = (i: number) => kind = i

export function tick(dt: number) {
  listen(dt)
  KINDS[kind].step(dt)
}

export function now(g: Ctx, right: number) {
  const name = playing(), d = KINDS[kind], full = Math.ceil(width(name) + d.wide) + 15
  x = name ? right - full + 5 : -1
  if (!name) return
  box(g, right - full, 8, full, 17, UI.border, UI.panel)
  text(g, name, right - 5, 20, UI.text, 'r')
  d.low?.(g, x)
}

export function glow(out: Ctx, k: number, level: number) {
  const d = KINDS[kind], w = Math.ceil(d.wide) + PAD * 2, c = sharp.canvas, keep = Math.round(level * 16), dark = shade.n
  shade.n = 0
  if (x < 0 || !d.high || !keep || dark > 15) return
  c.width = w * k
  c.height = TALL * k
  sharp.setTransform(k, 0, 0, k, (PAD - x) * k, -TOP * k)
  d.high(sharp, x, k)
  sharp.setTransform(1, 0, 0, 1, 0, 0)
  sharp.shadowBlur = 0
  sharp.imageSmoothingEnabled = false
  for (const [n, how] of [[keep % 16, 'destination-in'], [dark, 'destination-out']] as const) {
    if (!n) continue
    cut.canvas.width = w
    cut.setTransform(1, 0, 0, 1, PAD - x, -TOP)
    cut.fillStyle = mask(n)
    cut.fillRect(x - PAD, TOP, w, TALL)
    sharp.globalCompositeOperation = how
    sharp.drawImage(cut.canvas, 0, 0, c.width, c.height)
  }
  out.drawImage(c, (x - PAD) * k, TOP * k)
}
