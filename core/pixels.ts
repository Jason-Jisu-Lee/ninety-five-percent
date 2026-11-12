import { ctx, mk, u32 } from './canvas'

export function pixels(w: number, h: number) {
  const img = new ImageData(w, h), d = img.data, u = new Uint32Array(d.buffer)
  const at = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h ? y * w + x : -1
  return {
    u,
    set(x: number, y: number, col: string) {
      const i = at(x, y)
      if (i >= 0) u[i] = u32(col)
    },
    dark(x: number, y: number, f: number) {
      const i = at(x, y) * 4
      if (i < 0) return
      d[i] *= f
      d[i + 1] *= f
      d[i + 2] *= f
    },
    done() {
      const c = mk(w, h)
      ctx(c).putImageData(img, 0, 0)
      return c
    },
  }
}

export type Pixels = ReturnType<typeof pixels>
