export type Ctx = CanvasRenderingContext2D

export const mk = (w: number, h: number) => {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

export const ctx = (c: HTMLCanvasElement, o?: CanvasRenderingContext2DSettings) => c.getContext('2d', o)!

export const rgb = (h: string) => {
  const n = parseInt(h.slice(1), 16)
  return [n >> 16 & 255, n >> 8 & 255, n & 255]
}

const packed: Record<string, number> = {}
export const u32 = (h: string) => packed[h] ??= (([r, g, b]) => (0xff000000 | b << 16 | g << 8 | r) >>> 0)(rgb(h))
