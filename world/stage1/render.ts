import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { DF } from '../../data/dragonfly/body'
import { COLOR } from '../../data/dragonfly/colors'
import { FIGHT } from '../../data/dragonfly/fight'
import { FLY, STAMINA } from '../../data/dragonfly/flight'
import { stage } from '../../data/dragonfly/stats'
import { PREY } from '../../data/enemies/enemies'
import { FOREST as C, UI } from '../../data/look/palette'
import { PERCHES } from '../../data/stage1/map'
import { tag } from '../../ui/enemy/tag'
import { bar } from '../../ui/parts/bar'
import { marks, spot } from '../../ui/parts/marks'
import { ring } from '../../ui/parts/ring'
import { drawPrey } from '../creatures/draw'
import type { Prey } from '../creatures/prey'
import { wear } from '../dragonfly/sprite/sheet'
import type { hunt } from './hunt/hunt'
import type { Perch } from './hunt/sim'
import { glints } from './scenery/glints'
import { ground } from './scenery/ground'

const EDGE = [[1, 0], [-1, 0], [0, 1], [0, -1]]
const span = (p: Prey) => Math.ceil(Math.max(PREY[p.kind].len, PREY[p.kind].wing * 2 + PREY[p.kind].wide) / 2) + 3

export function render(g: Ctx, sim: ReturnType<typeof hunt>, clock: number, live: boolean, aim: Perch | null, hot: Prey | null) {
  const { fly, prey, fx, held } = sim, chew = held ? 1 + +(sim.bite > FIGHT.bite * .55) : 0
  const [spr, sh] = wear(COLOR, [stage(save.lv.speed), stage(save.lv.power)])(fly.heading, fly.frame, chew, fly.lean), half = spr.width >> 1
  const x = Math.round(fly.x) + (sim.hurt > 0 ? sim.hurt * 40 & 1 || -1 : 0), y = Math.round(fly.y - fly.h * .7), mid = sim.ahead(DF.mid)
  g.drawImage(ground(), 0, 0)
  glints(g, clock)
  fx.litter(g)
  for (const p of prey.list) drawPrey(g, p, clock, true)
  g.drawImage(sh, Math.round(fly.x + fly.h * .45) - half, Math.round(fly.y) - half)
  for (const p of prey.list) drawPrey(g, p, clock)
  if (live && sim.sel) {
    for (const r of PERCHES) if (r !== aim && r !== sim.rest) spot(g, r.x, Math.round(r.y - r.h * .7), UI.ally)
    if (aim) ring(g, aim.x, Math.round(aim.y - aim.h * .7), 7, UI.ally)
    marks(g, Math.round(mid[0]), Math.round(mid[1] - fly.h * .7), FLY.reach - 2, UI.ally, 4)
  }
  g.drawImage(spr, x - half, y - half)
  if (held) {
    for (const [dx, dy] of EDGE) drawPrey(g, { ...held, x: held.x + dx, y: held.y + dy }, clock, false, C.red)
    drawPrey(g, held, clock)
    if (held !== hot) bar(g, Math.round(held.x), Math.round(held.y - held.h * .7) + (Math.sin(fly.ang) > .35 ? 7 : -9), Math.max(0, held.hp) / PREY[held.kind].hp, Math.min(40, 10 + 2 * PREY[held.kind].hp), UI.foe)
  }
  if (live) for (const p of hot === sim.mark ? [hot] : [sim.mark, hot]) if (p) marks(g, Math.round(p.x), Math.round(p.y - p.h * .7), span(p), UI.foe)
  fx.numbers(g)
  if (live && hot) tag(g, hot, span(hot), hot === held && fly.y < hot.y)
  if (!live) return
  if (sim.health < sim.cap) bar(g, x, y - 26, Math.max(0, sim.health / sim.cap), 18, UI.ally)
  if (sim.sel || sim.shown > 0 || sim.stamina < (fly.perched ? 99 : STAMINA.show))
    bar(g, x, y - 23, sim.stamina / 100, 18, sim.stamina < STAMINA.tired ? C.pink : UI.accent, fly.perched && sim.stamina < STAMINA.wake ? STAMINA.wake / 100 : 0)
}
