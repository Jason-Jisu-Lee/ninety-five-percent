import { own } from '../../core/save/save'
import { AUTO, FIGHT } from '../../data/dragonfly/fight'
import { H, W } from '../../data/look/screen'
import { odds } from '../creatures/odds'
import type { Prey } from '../creatures/prey'
import type { Sim } from './sim'

const TAU = Math.PI * 2

function way(s: Sim, p: Prey) {
  const { fly } = s, r = fly.top() / fly.veer(), [px, py] = fly.aim(p), dx = px - fly.x, dy = py - fly.y, c = Math.cos(fly.ang), n = Math.sin(fly.ang), f = dx * c + dy * n, side = Math.abs(dy * c - dx * n)
  const arc = (l: number) => {
    const d = Math.hypot(f, l - r)
    return d < r ? Infinity : r * (((Math.atan2(f, r - l) - Math.acos(r / d)) % TAU + TAU) % TAU) + Math.sqrt(d * d - r * r)
  }
  return Math.min(arc(side), arc(-side))
}

export function scout(s: Sim) {
  const fit = (p: Prey | null): p is Prey => !!p && p !== s.held && p.x >= 0 && p.x <= W && p.y >= 0 && p.y <= H && odds(p.kind, own('power'), +s.health.toFixed(2), own('armor'), own('bite')) >= FIGHT.sure
  const now = fit(s.mark) ? way(s, s.mark) : Infinity
  let best: Prey | null = null, least = now * (s.held ? AUTO.keep : AUTO.swap)
  for (const p of s.prey.list) {
    if (p === s.mark || !fit(p)) continue
    const d = way(s, p)
    if (d < least) [best, least] = [p, d]
  }
  return best ?? (now < Infinity ? s.mark : null)
}
