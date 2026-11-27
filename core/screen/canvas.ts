export type Ctx = CanvasRenderingContext2D

export const mk = (w: number, h: number) => {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

export const ctx = (c: HTMLCanvasElement, o?: CanvasRenderingContext2DSettings) => c.getContext('2d', o)!

export const exact = (g: Ctx) => {
  const m = g.getTransform()
  return g.globalAlpha === 1 && g.globalCompositeOperation === 'source-over' && m.a === 1 && m.d === 1 && !m.b && !m.c && Number.isInteger(m.e) && Number.isInteger(m.f)
}

export const rgb = (h: string) => {
  const n = parseInt(h.slice(1), 16)
  return [n >> 16 & 255, n >> 8 & 255, n & 255]
}

export const blend = (a: string, b: string, t: number) => `rgb(${rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * t))})`

const packed: Record<string, number> = {}
export const u32 = (h: string) => packed[h] ??= (([r, g, b]) => (0xff000000 | b << 16 | g << 8 | r) >>> 0)(rgb(h))
