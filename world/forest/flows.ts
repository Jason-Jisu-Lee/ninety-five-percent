import type { Ctx } from '../../core/canvas'
import { still } from '../../core/motion'
import { once } from '../../core/once'
import { rng } from '../../core/rng'
import { RIVER } from '../../data/forest'
import { FOREST as C } from '../../data/palette'
import { H, W } from '../../data/screen'
import { ground } from './ground'
import { river } from './river'

const lines = once(() => {
  const R = rng(99), n = river().path.length
  return Array.from({ length: 30 }, () => {
    const lat = (R() * 2 - 1) * (RIVER.half - 7)
    return { lat, s: R() * n, len: 4 + (R() * 7 | 0), sp: (12 + R() * 6) * (1.2 - (lat / RIVER.half) ** 2), bright: R() < .3 }
  })
})

export function flows(g: Ctx, t: number) {
  const { path } = river(), { free } = ground()
  for (const f of lines()) {
    const s0 = still ? f.s : (f.s + t * f.sp) % (path.length + 20)
    g.fillStyle = f.bright ? C.glint : C.wSh
    for (let k = 0; k < f.len; k++) {
      const q = path[Math.floor(s0) - k]
      if (!q) continue
      const x = Math.round(q.x + q.nx * f.lat), y = Math.round(q.y + q.ny * f.lat)
      if (x >= 0 && y >= 0 && x < W && y < H && free[y * W + x]) g.fillRect(x, y, 1, 1)
    }
  }
}
