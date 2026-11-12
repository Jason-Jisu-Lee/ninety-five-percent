import { still } from '../../core/motion'
import { WIND } from '../../data/forest'
import { W } from '../../data/screen'

export function wind() {
  const gusts: number[] = [], [lo, hi] = WIND.every, [a, b, c] = WIND.band
  let next = 1.5
  return {
    step(t: number) {
      if (!still && t >= next) {
        gusts.push(t)
        next = t + lo + Math.random() * (hi - lo)
      }
      while (gusts.length && (t - gusts[0]) * WIND.speed > W + 320) gusts.shift()
    },
    lean(x: number, y: number, j: number, t: number) {
      const u = x * WIND.dir[0] + y * WIND.dir[1] + j
      for (const t0 of gusts) {
        const q = -80 + (t - t0) * WIND.speed - u
        if (q >= 0 && q < c) return q < a || q >= b ? 1 : 2
      }
      return 0
    },
  }
}
