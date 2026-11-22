import { pixels } from '../../core/draw/pixels'
import { rng } from '../../core/math/rng'
import { H, W } from '../../data/look/screen'
import { CX, CY, zoom, type Own } from '../../data/map/plan'
import { log, logShade } from '../stage1/scenery/log'
import { pads } from '../stage1/scenery/pond'
import type { Trunk } from './land'
import type { World } from './make'
import { soil } from './soil'
import { DRAW, FLAT } from './thing'
import { tree } from './tree'

export function paint(m: World, level: number, has: (own: Own) => boolean) {
  const s = zoom(level), k = 1 / s, x0 = CX - W * s / 2, y0 = CY - H * s / 2, p = pixels(W, H), deep = soil(m, p, x0, y0, s)
  const sx = (x: number) => (x - x0) * k, sy = (y: number) => (y - y0) * k
  const fit = (t: Trunk) => ({ ...t, x: sx(t.x), y: sy(t.y), len: t.len * k, r: t.r * k, stubs: t.stubs.map(([u, side, turn, len]) => [u * k, side, turn, len * k]), fungi: t.fungi.map(u => u * k) })
  const seen = m.things.map((t, i) => ({ t, i, x: Math.round(sx(t.x)), y: Math.round(sy(t.y)), tier: FLAT.indexOf(t.kind) }))
    .filter(q => (!q.t.own || has(q.t.own)) && q.x > -50 && q.y > -50 && q.x < W + 50 && q.y < H + 70)
  const draw = (q: (typeof seen)[number]) => DRAW[q.t.kind](p, q.t, q.x, q.y, k, rng(m.seed * 977 + q.i), deep)
  const logs = [m.trunk, ...has('log') ? [m.log] : []].map(fit)
  pads(p, seen.filter(q => q.t.kind === 'pad').map(q => [q.x, q.y, q.t.a * k, q.t.b]), k)
  for (const t of logs) logShade(p, t)
  seen.filter(q => q.tier >= 0).sort((a, b) => a.tier - b.tier || a.y - b.y).forEach(draw)
  for (const t of logs) log(p, t)
  const tall: [number, () => unknown][] = [...seen.filter(q => q.tier < 0).map((q): [number, () => unknown] => [q.y, () => draw(q)]),
    ...m.trees.map((t): [number, () => unknown] => [sy(t.y + t.r * .6), () => tree(p, sx(t.x), sy(t.y), t.r * k, t.roots, k)])]
  for (const [, put] of tall.sort((a, b) => a[0] - b[0])) put()
  return p.done()
}
