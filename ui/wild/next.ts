import { sound } from '../../audio/player/sound'
import { afford, save } from '../../core/save/save'
import { pack } from '../../core/save/wild'
import type { Ctx } from '../../core/screen/canvas'
import { H, W } from '../../data/look/screen'
import { WILD, type Wild } from '../../data/shop/wild'
import { foe } from '../enemy/card'
import { details, DW } from '../parts/details'
import { width } from '../text/text'
import { card, GAP, PEEK, RISE, tall } from './card'

const label = (w: Wild) => w.kind ? [w.name] : ['Expansion:', w.name], REACH = 6, GRACE = 280

export const CW = Math.max(62, ...WILD.flatMap(w => label(w).map(l => width(l) + 10))), X = W - 8 - CW * 2 - GAP
export const SLOTS = [X, H - PEEK, CW * 2 + GAP, PEEK - 4]
const after = () => WILD[pack.got]?.kind ? WILD[pack.got + 1] : undefined
export const spot = () => X + +!after() * (CW + GAP)

export function nextWild(buy: () => void) {
  let hot = false, open = false, left = 0, mx = -1, my = -1, box = [0, 0, 0]
  const now = () => save.fed ? WILD[pack.got] : undefined, can = () => afford(now()?.cost)
  const on = (x: number, y: number, wide: number) => !!now() && x >= spot() && x < spot() + wide && y >= H - tall(label(now()!)) - RISE
  const inside = (x: number, y: number) => open && x >= box[0] - REACH && x < box[0] + DW + REACH && y >= box[1] - REACH && y < box[1] + box[2] + REACH
  return {
    hover(x: number, y: number) {
      const was = hot
      ;[mx, my, hot] = [x, y, on(x, y, CW)]
      if (hot && !was) sound('tap')
      if (hot || inside(x, y)) [open, left] = [!!now()?.kind, 0]
      else if (open) left ||= performance.now()
      return hot && can() || inside(x, y)
    },
    click(x: number, y: number) {
      const hit = on(x, y, after() ? CW * 2 + GAP : CW) || inside(x, y)
      if (on(x, y, CW)) buy()
      return hit
    },
    draw(g: Ctx) {
      const w = now(), next = after()
      if (left && performance.now() - left > GRACE) open = false
      if (!w) return
      if (next) card(g, X + CW + GAP, CW, [], next.cost, false, false)
      const y = card(g, spot(), CW, label(w), w.cost, can(), hot || open)
      if (open && w.kind) box = details(g, foe(w.kind), t => [W - 8 - DW, y - 6 - t], mx, my)
    },
  }
}
