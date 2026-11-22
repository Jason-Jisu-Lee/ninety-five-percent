import { fbm, vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'

export function shore(R: () => number, share = .5 + R() * .12) {
  const turn = R() * 6.283, cx = Math.cos(turn), cy = Math.sin(turn) * 1.5, seed = R() * 9999 | 0, raw = new Float32Array(W * H), sd = new Float32Array(W * H)
  const a = R() * 6.283, b = R() * 6.283, sx = -Math.sin(turn), sy = Math.cos(turn)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = (x - W / 2) * sx + (y - H / 2) * sy
    raw[y * W + x] = (x - W / 2) * cx + (y - H / 2) * cy + 58 * Math.sin(u / 92 + a) + 26 * Math.sin(u / 43 + b) + (fbm(x / 210, y / 210, seed) - .5) * 120 + (vnoise(x / 85, y / 85, seed + 3) - .5) * 40
  }
  const level = Float32Array.from(raw).sort()[Math.floor(W * H * (1 - share))]
  const sweep = (wet: boolean) => {
    const d = new Float32Array(W * H).fill(1e4)
    for (let i = 0; i < W * H; i++) if (raw[i] > level !== wet) d[i] = 0
    for (const dir of [1, -1]) for (let k = 0; k < W * H; k++) {
      const i = dir > 0 ? k : W * H - 1 - k, x = i % W, up = i - dir * W, row = up >= 0 && up < W * H
      let best = d[i]
      if (x - dir >= 0 && x - dir < W) best = Math.min(best, d[i - dir] + 1, row ? d[up - dir] + 1.414 : 1e4)
      if (row) best = Math.min(best, d[up] + 1, x + dir >= 0 && x + dir < W ? d[up + dir] + 1.414 : 1e4)
      d[i] = best
    }
    return d
  }
  const inWater = sweep(true), onLand = sweep(false)
  for (let i = 0; i < W * H; i++) sd[i] = raw[i] > level ? inWater[i] - .5 : .5 - onLand[i]
  return (x: number, y: number) => sd[Math.min(H - 1, Math.max(0, Math.round(y))) * W + Math.min(W - 1, Math.max(0, Math.round(x)))]
}

export type Shore = ReturnType<typeof shore>
