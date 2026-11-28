import type { Ctx } from '../../core/screen/canvas'
import { ORB, UI } from '../../data/look/palette'
import { text } from '../text/text'

const LIFE = .9, MERGE = .4, RISE = 8, AWAY = .1

export function gain() {
  let last = 0, seen = -1, list: { n: number; at: number }[] = []
  return (g: Ctx, value: number, x: number, y: number, side?: 'r') => {
    const now = performance.now() / 1000, top = list.at(-1), d = Math.round(value) - Math.round(last)
    if (now - seen > AWAY) list = []
    else if (d && top && now - top.at < MERGE && Math.sign(top.n) === Math.sign(d)) [top.n, top.at] = [top.n + d, now]
    else if (d) list.push({ n: d, at: now })
    ;[last, seen] = [value, now]
    list = list.filter(p => now - p.at < LIFE)
    for (const p of list) {
      const u = (now - p.at) / LIFE
      g.globalAlpha = Math.min(1, (1 - u) * 3)
      text(g, (p.n > 0 ? '+' : '') + p.n, x, Math.round(y - u * RISE), ORB['#'], side, UI.panel)
    }
    g.globalAlpha = 1
  }
}
