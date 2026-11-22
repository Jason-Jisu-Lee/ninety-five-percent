import { dissolve } from '../../core/draw/dissolve'
import { clamp } from '../../core/math/clamp'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { PREY } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import type { Wild } from '../../data/shop/wild'
import { drawPrey } from '../../world/creatures/draw'
import type { Prey } from '../../world/creatures/prey'
import { scene } from '../../world/place/place'
import { traits } from '../enemy/traits'
import { text } from '../text/text'
import { wrap } from '../text/wrap'

const BW = 176, BH = 80, X = 432, Y = 96, EDGE = .25, LOOP = 260, A = 58, B = 16, LIFT = .6, SIT = 2.5, TURN = Math.PI * 2, view = ctx(mk(BW, BH))
const far = (p: number[]) => Math.hypot(p[0] - W / 2, p[1] - H / 2)
let shown: Wild | undefined, from = 0

function frame(w: Wild, t: number) {
  const { art, flowers, sites, rafts } = scene(w.stage), k = w.kind && PREY[w.kind], spots = !k || k.zone === 'flowers' ? flowers : !k.land ? [] : k.zone === 'water' ? rafts : sites
  const [sx, sy] = spots.reduce((a, b) => far(b) < far(a) ? b : a, spots[0] ?? [W / 2, H / 2]), left = clamp(Math.round(sx) - BW / 2, 0, W - BW), top = clamp(Math.round(sy) - BH / 2 - 4, 0, H - BH)
  view.drawImage(art, left, top, BW, BH, 0, 0, BW, BH)
  if (!k) return view.canvas
  const fly = LOOP / k.speed, u = k.land ? t % (fly + Math.min(k.sit, SIT)) / fly : t / fly % 1, e = Math.min(1, u), th = k.speed ? TURN * (k.land ? e * e * (3 - 2 * e) : e) : 0
  const up = k.land ? Math.min(1, Math.min(th, TURN - th) / LIFT) : 1, h = 2 + (k.h + Math.sin(t * 3) * 2 - 2) * up
  const foe = { kind: w.kind, x: sx - left + A * Math.sin(th), y: sy - top + B * Math.sin(th * 2), h, ang: Math.atan2(B * 2 * Math.cos(th * 2), A * Math.cos(th)), hp: k.hp, wings: true, gold: false, flash: 0, seed: .3 } as Prey
  drawPrey(view, foe, t, true)
  drawPrey(view, foe, t)
  return view.canvas
}

export function wild(g: Ctx, w?: Wild) {
  const now = performance.now() / 1000
  if (w && w !== shown) [shown, from] = [w, now]
  if (!shown) return
  const k = shown.kind && PREY[shown.kind]
  let y = 203
  dissolve(g, frame(shown, now - from), X, Y, Math.min(1, (now - from) / EDGE))
  text(g, shown.name, X, 190, UI.gold)
  if (!k) return
  for (const line of wrap(k.text, BW)) text(g, line, X, (y += 11) - 11, UI.text)
  ;[['Health', k.hp], ['Blood', k.blood], ['Power', k.power], ['Speed', k.speed]].forEach(([name, n], i) => {
    text(g, String(name), X + (i & 1) * 92, y + 4 + (i >> 1) * 11, UI.dim)
    text(g, String(Math.round(+n)), X + (i & 1) * 92 + 84, y + 4 + (i >> 1) * 11, UI.text, 'r')
  })
  for (const [name] of traits(k)) text(g, name, X, (y += 11) + 19, UI.gold)
}
