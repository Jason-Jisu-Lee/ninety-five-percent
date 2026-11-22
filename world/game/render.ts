import type { Ctx } from '../../core/screen/canvas'
import { COLOR } from '../../data/dragonfly/colors'
import { FIGHT } from '../../data/dragonfly/fight'
import { STAMINA } from '../../data/dragonfly/flight'
import { PREY } from '../../data/enemies/enemies'
import { FOREST as C, UI } from '../../data/look/palette'
import { tag } from '../../ui/enemy/tag'
import { bar } from '../../ui/parts/bar'
import { marks } from '../../ui/parts/marks'
import { drawPrey } from '../creatures/draw'
import type { Prey } from '../creatures/prey'
import { wear } from '../dragonfly/sprite/sheet'
import type { hunt } from '../hunt/hunt'
import { glints } from '../place/glints'
import { place } from '../place/place'

const span = (p: Prey) => Math.ceil(Math.max(PREY[p.kind].len, PREY[p.kind].wing * 2 + PREY[p.kind].wide) / 2) + 3

export function render(g: Ctx, sim: ReturnType<typeof hunt>, clock: number, live: boolean, hot: Prey | null) {
  const { fly, prey, fx, held } = sim, chew = held ? 1 + +(sim.bite > FIGHT.bite * .55) : 0
  const [spr, sh] = wear(COLOR)(fly.heading, fly.frame, chew, fly.lean), half = spr.width >> 1
  const x = Math.round(fly.x) + (sim.hurt > 0 ? sim.hurt * 40 & 1 || -1 : 0), y = Math.round(fly.y - fly.h * .7)
  g.drawImage(place().art, 0, 0)
  glints(g, clock)
  fx.litter(g)
  for (const p of prey.list) drawPrey(g, p, clock, true)
  g.drawImage(sh, Math.round(fly.x + fly.h * .45) - half, Math.round(fly.y) - half)
  for (const p of prey.list) drawPrey(g, p, clock)
  g.drawImage(spr, x - half, y - half)
  if (held) {
    drawPrey(g, held, clock)
    if (held !== hot) bar(g, Math.round(held.x), Math.round(held.y - held.h * .7) + (Math.sin(fly.ang) > .35 ? 7 : -9), Math.max(0, held.hp) / PREY[held.kind].hp, Math.min(40, 10 + 2 * PREY[held.kind].hp), UI.foe)
  }
  if (live) for (const p of hot === sim.mark ? [hot] : [sim.mark, hot]) if (p) marks(g, Math.round(p.x), Math.round(p.y - p.h * .7), span(p), UI.foe)
  fx.numbers(g)
  if (live && hot) tag(g, hot, span(hot), hot === held && fly.y < hot.y)
  if (!live) return
  if (sim.health < sim.cap) bar(g, x, y - 26, Math.max(0, sim.health / sim.cap), 18, UI.ally)
  bar(g, x, y - 23, sim.stamina / 100, 18, sim.stamina < STAMINA.tired ? C.pink : UI.accent)
}
