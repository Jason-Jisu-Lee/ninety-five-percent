import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { TIRED as T } from '../../data/game/hints'
import { W } from '../../data/look/screen'
import type { Sim } from '../../world/hunt/sim'
import type { Perch } from '../../world/place/kit'
import { chevron } from '../parts/chevron'
import { note } from '../parts/note'
import { width } from '../text/text'

const at = (p: Perch) => [Math.round(p.x), Math.round(p.y - p.h * .7)], wide = Math.max(...T.lines.map(l => width(l))) + 10

export function tired(g: Ctx, sim: Sim, u: number) {
  const { fly, rest } = sim, x = Math.round(fly.x), y = Math.round(fly.y - fly.h * .7), up = y > 80
  if (rest && !fly.perched) chevron(g, at(rest)[0] - 2, at(rest)[1] - 12 - +(u % .8 > .4), 1)
  note(g, T.lines, clamp(Math.round(x - wide / 2), 2, W - wide - 2), up ? y - 30 : y + 22, false, up)
}
