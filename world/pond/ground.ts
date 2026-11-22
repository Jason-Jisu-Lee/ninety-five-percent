import { clamp } from '../../core/math/clamp'
import { fbm, hash, vnoise } from '../../core/math/noise'
import { H, W } from '../../data/look/screen'
import type { Pen } from './pen'
import type { Shore } from './shore'

const SUN = .62

export const fields = (s: number) => ({
  s,
  beach: (x: number, y: number) => clamp((vnoise(x / 55, y / 55, s) - .36) * 64, 0, 24),
  depth: (x: number, y: number, d: number) => d / (.5 + 1.2 * vnoise(x / 120, y / 120, s + 1)),
})

function box(from: Float32Array, to: Float32Array, n: number, lines: number, step: number, skip: number, r: number) {
  for (let l = 0; l < lines; l++) {
    const o = l * skip
    let sum = from[o] * (r + 1)
    for (let k = 1; k <= r; k++) sum += from[o + Math.min(k, n - 1) * step]
    for (let i = 0; i < n; i++) {
      to[o + i * step] = sum / (2 * r + 1)
      sum += from[o + Math.min(i + r + 1, n - 1) * step] - from[o + Math.max(i - r, 0) * step]
    }
  }
}

function soften(make: (x: number, y: number) => number, r: number) {
  const f = new Float32Array(W * H), t = new Float32Array(W * H)
  for (let i = 0; i < W * H; i++) f[i] = make(i % W, i / W | 0)
  for (let i = 0; i < 2; i++) box(f, t, W, H, 1, W, r), box(t, f, H, W, W, 1, r)
  return f
}

export function ticker(p: Pen) {
  const used = new Set<number>()
  return (x: number, y: number, light: boolean) => {
    const key = (y / 4 | 0) * 256 + (x / 6 | 0)
    if ([0, 1, -1, 256, -256].some(k => used.has(key + k)) || !p.clear([x - 1, y - 2, x + 1, y])) return
    used.add(key)
    for (const [dx, dy] of light ? [[0, 0], [0, -1], [1, -2], [-1, 0]] : [[0, 0], [0, -1], [-1, -2]]) p.dot(x + dx, y + dy, p.L.grass[light ? dx < 0 ? 0 : 3 : 0])
  }
}

export function ground(p: Pen, sd: Shore, { s, beach, depth }: ReturnType<typeof fields>, tick: ReturnType<typeof ticker>) {
  const { water, grass, earth } = p.L, deep = soften((x, y) => Math.max(-8, depth(x, y, sd(x, y))), 6), sun = soften((x, y) => fbm((x * .8 + y * .6) / 80, (y * .8 - x * .6) / 66, s + 2), 3)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, d = sd(x, y), a = -d, sand = beach(x, y), over = a + (vnoise(x / 7, y / 7, s + 7) - .5) * 7
    p.dot(x, y, d > 0
      ? d < 1.4 && vnoise(x / 27, y / 27, s + 8) > .3 ? water[3] : deep[i] < 26 ? water[2] : deep[i] < 100 + (vnoise(x / 90, y / 90, s + 4) - .5) * 40 ? water[1] : water[0]
      : a < 1.3 ? earth[0] : over < sand ? a < 2 + 2.5 * vnoise(x / 20, y / 20, s + 10) ? earth[1] : a > sand * .4 && vnoise(x / 30, y / 30, s + 3) > .6 ? earth[3] : earth[2]
        : over < sand + 1.6 || a - sand < 2 + 5 * vnoise(x / 40, y / 40, s + 5) ? grass[0] : sun[i] - clamp((34 - a + sand) / 34, 0, 1) * .25 > SUN ? grass[2] : grass[1])
  }
  for (let y = 3; y < H; y++) for (let x = 1; x < W - 2; x++)
    if (Math.abs(sun[y * W + x] - SUN) < .012 && vnoise(x / 16, y / 16, s + 6) > .62 && hash(x, y, s) > .88 && sd(x, y) < -beach(x, y) - 36) tick(x, y, hash(x, y, s + 9) > .4)
}
