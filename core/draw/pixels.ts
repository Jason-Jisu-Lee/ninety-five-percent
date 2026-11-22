import { ctx, mk } from '../screen/canvas'

export function pixels(w: number, h: number) {
  const img = new ImageData(w, h)
  return {
    u: new Uint32Array(img.data.buffer),
    done() {
      const c = mk(w, h)
      ctx(c).putImageData(img, 0, 0)
      return c
    },
  }
}
