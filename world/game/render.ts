import type { Ctx } from '../../core/screen/canvas'
import { own, save } from '../../core/save/save'
import { FIGHT, LUNGE } from '../../data/dragonfly/fight'
import { STAMINA } from '../../data/dragonfly/flight'
import { PREY } from '../../data/enemies/enemies'
import { FOREST as C, UI } from '../../data/look/palette'
import { tag } from '../../ui/enemy/tag'
import { hint } from '../../ui/hint/hint'
import { tired } from '../../ui/hint/tired'
import { bar, LIFE } from '../../ui/parts/bar'
import { marks } from '../../ui/parts/marks'
import { squeeze } from '../../ui/parts/squeeze'
import { drawPrey } from '../creatures/draw'
import type { Prey } from '../creatures/prey'
import { span } from '../creatures/span'
import { wear } from '../dragonfly/sprite/sheet'
import type { hunt } from '../hunt/hunt'
import { glints } from '../place/glints'
import { place } from '../place/place'

export function render(g: Ctx, sim: ReturnType<typeof hunt>, clock: number, live: boolean, hot: Prey | null, me: boolean, teach = false, weary = -1, alone = false) {
  const { fly, prey, fx, held } = sim, ready = own('lunge') && !held && !sim.rest && !sim.used && sim.fit(), jig = sim.miss < LUNGE.shake ? Math.round(Math.sin(sim.miss / LUNGE.shake * Math.PI * 6) * 2) : 0, chew = held ? 1 + +(sim.bite > FIGHT.bite * .55) : 0
  const [spr, sh] = wear(save.color)(fly.heading, fly.frame, chew, fly.lean), half = spr.width >> 1
  const x = Math.round(fly.x) + (sim.hurt > 0 ? sim.hurt * 40 & 1 || -1 : 0), y = Math.round(fly.y - fly.h * .7)
  g.drawImage(place().art, 0, 0)
  glints(g, clock)
  fx.litter(g)
  const seen = alone ? [] : prey.list
  for (const p of seen) drawPrey(g, p, clock, true)
  g.drawImage(sh, Math.round(fly.x + fly.h * .45) - half, Math.round(fly.y) - half)
  for (const p of seen) drawPrey(g, p, clock)
  g.drawImage(spr, x - half, y - half)
  if (held) {
    drawPrey(g, held, clock)
    if (held !== hot) bar(g, Math.round(held.x), Math.round(held.y - held.h * .7) + (Math.sin(fly.ang) > .35 ? 7 : -9), Math.max(0, held.hp) / PREY[held.kind].hp, LIFE, UI.foe)
  }
  if (live) for (const p of hot === sim.mark ? [hot] : [sim.mark, hot]) if (p) marks(g, Math.round(p.x) + (p === sim.mark ? jig : 0), Math.round(p.y - p.h * .7), p === sim.mark && (ready || sim.primed) ? squeeze(span(p), sim.primed ? sim.tight : sim.span()) : span(p), UI.foe)
  if (live && me) marks(g, x, y, 13, UI.accent)
  if (live && teach) hint(g, sim, hot, clock)
  if (live && weary >= 0) tired(g, sim, weary)
  fx.numbers(g)
  if (live && hot) tag(g, hot, span(hot), hot === held && fly.y < hot.y, teach && !sim.mark && hot.kind === 'fruitfly' && clock % .7 < .16)
  if (!live) return
  if (sim.health < sim.cap) bar(g, x, y - 26, Math.max(0, sim.health / sim.cap), LIFE, UI.ally)
  bar(g, x, y - 23, sim.stamina / 100, 18, sim.stamina < STAMINA.tired ? C.pink : UI.vigor)
}
