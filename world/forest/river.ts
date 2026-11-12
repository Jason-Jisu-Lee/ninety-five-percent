import { once } from '../../core/once'
import { RIVER } from '../../data/forest'
import { H, W } from '../../data/screen'

export const river = once(() => {
  const p = RIVER.pts, ext = [p[0], ...p, p[p.length - 1]], raw: number[][] = []
  for (let i = 1; i < ext.length - 2; i++) for (let t = 0; t < 1; t += .01) {
    const [a, b, c, d] = [ext[i - 1], ext[i], ext[i + 1], ext[i + 2]], t2 = t * t, t3 = t2 * t
    raw.push([0, 1].map(k => .5 * (2 * b[k] + (-a[k] + c[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t2 + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * t3)))
  }
  let acc = 0, last = raw[0]
  const path = [{ x: last[0], y: last[1], nx: 0, ny: 0 }]
  for (const q of raw) {
    acc += Math.hypot(q[0] - last[0], q[1] - last[1])
    last = q
    if (acc < 1) continue
    path.push({ x: q[0], y: q[1], nx: 0, ny: 0 })
    acc = 0
  }
  path.forEach((q, i) => {
    const a = path[Math.max(0, i - 3)], b = path[Math.min(path.length - 1, i + 3)], l = Math.hypot(b.x - a.x, b.y - a.y) || 1
    q.nx = -(b.y - a.y) / l
    q.ny = (b.x - a.x) / l
  })
  const halfAt = (i: number) => RIVER.half + RIVER.wobble * Math.sin(i * .012), edge = new Float32Array(W * H)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let best = 1e9, bi = 0
    for (let i = 0; i < path.length; i += 2) {
      const dx = x - path[i].x, dy = y - path[i].y, d = dx * dx + dy * dy
      if (d < best) {
        best = d
        bi = i
      }
    }
    edge[y * W + x] = Math.sqrt(best) - halfAt(bi)
  }
  return {
    path,
    edge,
    E: (x: number, y: number) => x < 0 || y < 0 || x >= W || y >= H ? 99 : edge[y * W + x],
    bank(frac: number, side: number, inset: number) {
      const i = Math.floor(frac * (path.length - 1)), q = path[i], d = halfAt(i) + inset
      return [Math.round(q.x + q.nx * d * side), Math.round(q.y + q.ny * d * side)]
    },
  }
})
