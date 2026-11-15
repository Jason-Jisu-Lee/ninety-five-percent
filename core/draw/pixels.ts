import { ctx, mk, u32 } from '../screen/canvas'

export function pixels(w: number, h: number) {
  const img = new ImageData(w, h), u = new Uint32Array(img.data.buffer)
  const set = (x: number, y: number, col: string) => {
    if (x >= 0 && y >= 0 && x < w && y < h) u[y * w + x] = u32(col)
  }
  return {
    u,
    set,
    oval(cx: number, cy: number, rx: number, ry: number, ink: (x: number, y: number, d: number) => string | false) {
      for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2, col = d <= 1 && ink(x, y, d)
        if (col) set(x, y, col)
      }
    },
    done() {
      const c = mk(w, h)
      ctx(c).putImageData(img, 0, 0)
      return c
    },
  }
}

export type Pixels = ReturnType<typeof pixels>
