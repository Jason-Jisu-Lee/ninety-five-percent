import { bayer } from '../../core/draw/dither'
import { ctx, mk } from '../../core/screen/canvas'
import { H, W } from '../../data/look/screen'

export function mask() {
  const g = ctx(mk(W, H)), img = g.createImageData(W, H), px = new Uint32Array(img.data.buffer)
  return {
    canvas: g.canvas,
    cut(cx: number, cy: number, r: number, band: number, show: number) {
      for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i++) {
        const d = Math.sqrt((x + .5 - cx) ** 2 + (y + .5 - cy) ** 2), open = d <= r - band ? 1 : d >= r ? 0 : (r - d) / band
        px[i] = open * show > bayer(x, y) ? 0 : 0xff000000
      }
      g.putImageData(img, 0, 0)
    },
  }
}
