import { ctx, mk, type Ctx } from '../core/canvas'

const pad = ctx(mk(400, 40), { willReadFrequently: true }), cache = new Map<string, { c: HTMLCanvasElement; w: number }>()

function raster(str: string, size: number, col: string) {
  const key = size + col + str, hit = cache.get(key)
  if (hit) return hit
  pad.clearRect(0, 0, 400, 40)
  pad.font = `${size}px "Pixelify Sans", monospace`
  pad.fillStyle = '#fff'
  pad.fillText(str, 1, size + 3)
  const w = Math.ceil(pad.measureText(str).width) + 2, h = size + 8
  const id = pad.getImageData(0, 0, w, h).data, c = mk(w, h), g = ctx(c)
  g.fillStyle = col
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (id[(j * w + i) * 4 + 3] > 110) g.fillRect(i, j, 1, 1)
  if (cache.size > 400) cache.clear()
  const r = { c, w: w - 2 }
  cache.set(key, r)
  return r
}

export function text(g: Ctx, str: string, x: number, y: number, size: number, col: string, align?: 'c' | 'r', edge?: string) {
  const t = raster(str, size, col), left = (align === 'c' ? Math.round(x - t.w / 2) : align === 'r' ? Math.round(x - t.w) : x) - 1, top = y - size - 3
  if (edge) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) g.drawImage(raster(str, size, edge).c, left + dx, top + dy)
  g.drawImage(t.c, left, top)
}
