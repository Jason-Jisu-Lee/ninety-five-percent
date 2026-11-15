import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { COLOR } from '../../data/dragonfly/colors'
import { FLY, STAMINA } from '../../data/dragonfly/flight'
import { stage } from '../../data/dragonfly/stats'
import { FOREST as C, UI } from '../../data/look/palette'
import { PREY } from '../../data/stage1/enemies'
import { bar } from '../../ui/parts/bar'
import { ring } from '../../ui/parts/ring'
import { drawPrey } from '../creatures/draw'
import { wear } from '../dragonfly/sprite/sheet'
import type { hunt } from './hunt/hunt'
import type { Perch } from './hunt/sim'
import { glints } from './scenery/glints'
import { ground } from './scenery/ground'

const EDGE = [[1, 0], [-1, 0], [0, 1], [0, -1]]

export function render(g: Ctx, sim: ReturnType<typeof hunt>, clock: number, live: boolean, aim: Perch | null) {
  const { fly, prey, fx, held } = sim, [spr, sh] = wear(COLOR, [stage(save.lv.speed), stage(save.lv.power)])(fly.heading, fly.frame, !!held, fly.lean)
  const half = spr.width >> 1, x = Math.round(fly.x), y = Math.round(fly.y - fly.h * .7), sx = Math.round(fly.x + fly.h * .45), sy = Math.round(fly.y), mid = sim.ahead(-3.3)
  g.drawImage(ground(), 0, 0)
  glints(g, clock)
  fx.litter(g)
  for (const p of prey.list) drawPrey(g, p, clock, true)
  g.drawImage(sh, sx - half, sy - half)
  for (const p of prey.list) drawPrey(g, p, clock)
  if (live && aim) ring(g, aim.x, Math.round(aim.y - aim.h * .7), 7, UI.text)
  if (live && sim.sel) ring(g, Math.round(mid[0]), Math.round(mid[1] - fly.h * .7), FLY.reach, UI.text)
  g.drawImage(spr, x - half, y - half)
  if (held) {
    for (const [dx, dy] of EDGE) drawPrey(g, { ...held, x: held.x + dx, y: held.y + dy }, clock, false, C.red)
    drawPrey(g, held, clock)
    bar(g, Math.round(held.x), Math.round(held.y - held.h * .7) + (Math.sin(fly.ang) > .35 ? 7 : -9), Math.max(0, held.hp) / PREY[held.kind].hp, Math.min(40, 10 + 2 * PREY[held.kind].hp))
  }
  fx.numbers(g)
  if (!live || !sim.sel && sim.shown <= 0 && sim.stamina >= (fly.perched ? 99 : STAMINA.show)) return
  bar(g, x, y - 25, sim.stamina / 100, 20, sim.stamina < STAMINA.tired ? C.pink : UI.accent, fly.perched && sim.stamina < STAMINA.wake ? STAMINA.wake / 100 : 0)
}
