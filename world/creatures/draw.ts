import type { Ctx } from '../../core/screen/canvas'
import { FOREST as C } from '../../data/look/palette'
import { PREY } from '../../data/enemies/enemies'
import { frog } from './frog'
import type { Prey } from './prey'
import { SHAPES } from './shapes'

export type Bug = { shape: string; len: number; wide: number; wing: number; chord: number; beat: number; body: string; band: string; eye: string; tint: string; rim: string }
type Pose = { x: number; y: number; h: number; ang: number; flash: number; seed: number; wings: boolean }

export const cells = (p: Prey) => Math.max(1, Math.ceil(PREY[p.kind].len * p.hp / PREY[p.kind].hp))

function plot(g: Ctx, p: Pose, shadow: boolean) {
  const c = Math.cos(p.ang), s = Math.sin(p.ang), x0 = p.x + (shadow ? p.h * .45 : 0), y0 = p.y - (shadow ? 0 : p.h * .7)
  return (along: number, across: number, col: string, thin = false) => {
    const x = Math.round(x0 + c * along - s * across), y = Math.round(y0 + s * along + c * across)
    if (shadow && thin && x + y & 1) return
    g.fillStyle = shadow ? C.deep : p.flash > 0 ? C.white : col
    g.fillRect(x, y, 1, 1)
  }
}

export function drawBug(g: Ctx, k: Bug, p: Pose, n: number, t: number, shadow = false) {
  const dot = plot(g, p, shadow), edge = (k.wide - 1) / 2, fold = p.h < 6 || (t * k.beat + p.seed * 7) % 1 >= .5 ? .45 : 1, make = SHAPES[k.shape]
  if (k.shape === 'frog') return frog(dot, k, t + p.seed * 9)
  if (make) return make(n < k.len ? (a, c, col, thin) => a >= k.len / 2 - n && dot(a - (k.len - n) / 2, c, col, thin) : dot, !p.wings ? 0 : p.h < 6 ? .3 : fold, t + p.seed * 9)
  if (p.wings) for (const side of [-1, 1]) for (let i = 1; i <= k.wing; i += .5) {
    const reach = Math.max(1, k.chord * (1 - (i - 1) / k.wing))
    for (let j = 0; j < reach; j += .5) dot(n / 2 - 1 - j - (k.chord > 1 ? 0 : i * .4), side * (edge + i * fold), k.rim && (i > k.wing - 1 || j > reach - 1) ? k.rim : k.tint, true)
  }
  for (let i = 0; i < n; i += .5) for (let w = -edge; w <= edge; w += .5)
    if (k.wide < 3 || i >= 1 && i < n - 1 || Math.abs(w) < edge) dot(i - n / 2, w, i >= n - 1 ? k.eye : k.band && i & 1 ? k.band : k.body)
}

export const drawPrey = (g: Ctx, p: Prey, t: number, shadow = false) => drawBug(g, PREY[p.kind], p, cells(p), t, shadow)
