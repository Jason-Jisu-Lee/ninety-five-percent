import { ctx, mk, type Ctx } from '../screen/canvas'
import { H, W } from '../../data/look/screen'
import { bayer } from './dither'

const tmp = ctx(mk(1, 1)), cut = ctx(mk(W, H)), masks: CanvasPattern[] = []

export const shade = { n: 0 }

function mask(n: number) {
  if (masks[n]) return masks[n]
  const c = mk(4, 4), g = ctx(c)
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) if (bayer(x, y) * 16 < n) g.fillRect(x, y, 1, 1)
  return masks[n] = tmp.createPattern(c, 'repeat')!
}

export function dissolve(g: Ctx, src: HTMLCanvasElement, x: number, y: number, level: number) {
  const n = Math.round(level * 16), c = tmp.canvas, { width: w, height: h } = src
  if (n >= 16) return g.drawImage(src, x, y)
  if (n <= 0) return
  if (c.width < w || c.height < h) {
    c.width = Math.max(c.width, w)
    c.height = Math.max(c.height, h)
  }
  tmp.globalCompositeOperation = 'copy'
  tmp.drawImage(src, 0, 0)
  tmp.globalCompositeOperation = 'destination-in'
  tmp.fillStyle = mask(n)
  tmp.fillRect(0, 0, c.width, c.height)
  g.drawImage(c, 0, 0, w, h, x, y, w, h)
}

export function veil(g: Ctx, level: number) {
  shade.n = Math.max(shade.n, Math.round(level * 16))
  g.fillStyle = mask(Math.round(level * 16))
  g.fillRect(0, 0, W, H)
}

export function etch(g: Ctx, left: number, top: number, wide: number, tall: number, keep: number, dark: number) {
  g.setTransform(1, 0, 0, 1, 0, 0)
  g.imageSmoothingEnabled = false
  for (const [n, how] of [[keep % 16, 'destination-in'], [dark, 'destination-out']] as const) {
    if (!n) continue
    cut.clearRect(left, top, wide, tall)
    cut.fillStyle = mask(n)
    cut.fillRect(left, top, wide, tall)
    g.globalCompositeOperation = how
    g.drawImage(cut.canvas, left, top, wide, tall, 0, 0, g.canvas.width, g.canvas.height)
  }
  g.globalCompositeOperation = 'source-over'
}
