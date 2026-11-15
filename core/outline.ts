import { ctx, mk, type Ctx } from './canvas'

const tmp = ctx(mk(1, 1))

export function outline(g: Ctx, src: HTMLCanvasElement, x: number, y: number, col: string) {
  const c = tmp.canvas, { width: w, height: h } = src
  if (c.width < w || c.height < h) {
    c.width = Math.max(c.width, w)
    c.height = Math.max(c.height, h)
  }
  tmp.globalCompositeOperation = 'copy'
  tmp.drawImage(src, 0, 0)
  tmp.globalCompositeOperation = 'source-in'
  tmp.fillStyle = col
  tmp.fillRect(0, 0, w, h)
  for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]]) g.drawImage(c, 0, 0, w, h, x + dx, y + dy, w, h)
}
