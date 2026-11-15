import type { Ctx } from '../../core/canvas'
import { FOREST as C } from '../../data/palette'
import { PREY } from '../../data/stage1/enemies'
import type { Prey } from './prey'

type Bug = { len: number; wide: number; wing: number; chord: number; beat: number; body: string; band: string; eye: string; tint: string; tail?: string }
type Pose = { x: number; y: number; h: number; ang: number; flash: number; seed: number; wings: boolean }

export const cells = (p: Prey) => Math.max(1, Math.ceil(PREY[p.kind].len * p.hp / PREY[p.kind].hp))

export function drawBug(g: Ctx, k: Bug, p: Pose, n: number, t: number, shadow = false) {
  const c = Math.cos(p.ang), s = Math.sin(p.ang), edge = (k.wide - 1) / 2
  const x0 = p.x + (shadow ? p.h * .45 : 0), y0 = p.y - (shadow ? 0 : p.h * .7), fold = p.h < 6 || (t * k.beat + p.seed * 7) % 1 >= .5 ? .45 : 1
  const dot = (along: number, across: number, col: string, thin = false) => {
    const x = Math.round(x0 + c * along - s * across), y = Math.round(y0 + s * along + c * across)
    if (shadow && thin && x + y & 1) return
    g.fillStyle = shadow ? C.deep : p.flash > 0 ? C.white : col
    g.fillRect(x, y, 1, 1)
  }
  if (p.wings) for (const side of [-1, 1]) for (let i = 1; i <= k.wing; i += .5) for (let j = 0; j < Math.max(1, k.chord * (1 - (i - 1) / k.wing)); j += .5)
    dot(n / 2 - 1 - j - (k.chord > 1 ? 0 : i * .4), side * (edge + i * fold), k.tint, true)
  for (let i = 0; i < n; i += .5) for (let w = -edge; w <= edge; w += .5)
    if (k.wide < 3 || i >= 1 && i < n - 1 || Math.abs(w) < edge) dot(i - n / 2, w, i >= n - 1 ? k.eye : i < 1 && k.tail ? k.tail : k.band && i & 1 ? k.band : k.body)
}

export const drawPrey = (g: Ctx, p: Prey, t: number, shadow = false) => drawBug(g, PREY[p.kind], p, cells(p), t, shadow)
