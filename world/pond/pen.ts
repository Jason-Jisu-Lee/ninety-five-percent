import { pixels } from '../../core/draw/pixels'
import { u32 } from '../../core/screen/canvas'
import type { Look } from '../../data/pond/looks'

type Ink = (nx: number, ny: number, x: number, y: number) => string | false | undefined

export function pen(L: Look, w: number, h: number) {
  const p = pixels(w, h), dark = new Map<number, number>(), shaded = new Uint8Array(w * h), own = new Uint8Array(w * h), edge = L.line && u32(L.line)
  let trail: number[] | undefined, who = 0, clash = 0
  for (const ramp of [[L.abyss, ...L.water], L.grass, L.earth, L.plant, L.head, L.pad, L.stone, L.wood]) ramp.forEach((c, i) => i && dark.set(u32(c), u32(ramp[i - 1])))
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h
  const dot = (x: number, y: number, col: string) => {
    if (!inside(x = Math.round(x), y = Math.round(y))) return
    const i = y * w + x
    if (who && own[i] && own[i] !== who) clash++
    if (who) own[i] = who
    p.u[i] = u32(col)
    shaded[i] = 0
    trail?.push(i)
  }
  const dim = (x: number, y: number) => {
    const i = Math.round(y) * w + Math.round(x), to = !inside(Math.round(x), Math.round(y)) || shaded[i] ? 0 : dark.get(p.u[i])
    if (to) [p.u[i], shaded[i]] = [to, 1]
  }
  const is = (x: number, y: number, ramp: string[]) => inside(x = Math.round(x), y = Math.round(y)) && ramp.some(c => u32(c) === p.u[y * w + x])
  const each = (cx: number, cy: number, rx: number, ry: number, f: (nx: number, ny: number, x: number, y: number) => void) => {
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) f((x - cx) / rx, (y - cy) / ry, x, y)
  }
  const area = ([x0, y0, x1, y1]: number[], f: (i: number) => boolean) => {
    for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(h - 1, y1); y++) for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(w - 1, x1); x++) if (!f(y * w + x)) return false
    return true
  }
  const clear = (box: number[], id = 0) => area(box, i => !own[i] || own[i] === id)
  return {
    L, w, h, dot, dim, is, clear, done: p.done,
    tag: (id: number) => who = id,
    hold: (box: number[]) => area(box, i => !!(own[i] = 255)),
    clash: () => clash,
    lift(x: number, y: number) {
      const k = clear([x = Math.round(x), y = Math.round(y), x, y], who) ? [0, 1, 2].find(k => is(x, y, [L.water[k]])) : undefined
      if (k !== undefined) dot(x, y, L.water[k + 1])
    },
    blob: (cx: number, cy: number, rx: number, ry: number, ink: Ink) => each(cx, cy, rx, ry, (nx, ny, x, y) => {
      const col = ink(nx, ny, x, y)
      if (col) dot(x, y, col)
    }),
    shade: (cx: number, cy: number, rx: number, ry: number, keep: (nx: number, ny: number) => boolean = (nx, ny) => nx * nx + ny * ny <= 1) =>
      each(cx + L.cast[0], cy + L.cast[1], rx, ry, (nx, ny, x, y) => keep(nx, ny) && dim(x, y)),
    curve(x: number, y: number, len: number, ang: number, bend: number, wide: (t: number) => number, ink: (t: number, side: number) => string | false | 0) {
      const c = Math.cos(ang), s = Math.sin(ang), flat = Math.abs(c) > Math.abs(s)
      for (let i = 0, n = Math.ceil(len * 1.5); i <= n; i++) {
        const t = i / n, px = x + c * len * t - s * bend * t * t, py = y + s * len * t + c * bend * t * t, m = Math.max(1, Math.round(wide(t)))
        for (let k = 0; k < m; k++) {
          const col = ink(t, m > 1 ? k / (m - 1) : .5), qx = flat ? px : px + k - (m >> 1), qy = flat ? py + k - (m >> 1) : py
          if (col === 0) dim(qx, qy)
          else if (col) dot(qx, qy, col)
        }
      }
    },
    shape(draw: () => void) {
      trail = []
      draw()
      const mine = new Set(trail)
      if (edge) for (const i of mine) for (const j of [i - 1, i + 1, i - w, i + w]) if (!mine.has(j) && j >= 0 && j < w * h && Math.abs(j % w - i % w) < 2) p.u[j] = edge, own[j] ||= who
      trail = undefined
    },
  }
}

export type Pen = ReturnType<typeof pen>
