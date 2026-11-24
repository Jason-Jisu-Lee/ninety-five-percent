import { bayer } from '../../core/draw/dither'
import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { TIRED as T } from '../../data/game/hints'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import type { Sim } from '../../world/hunt/sim'
import type { Perch } from '../../world/place/kit'
import { place } from '../../world/place/place'
import { chevron } from '../parts/chevron'
import { note } from '../parts/note'
import { width } from '../text/text'

const at = (p: Perch) => [Math.round(p.x), Math.round(p.y - p.h * .7)], wide = Math.max(...T.lines.map(l => width(l))) + 10

function ring(g: Ctx, x: number, y: number, e: number) {
  const r = 3 + 9 * e
  for (const [col, o] of [[UI.panel, 1], [UI.text, 0]] as const) for (let a = 0; a < 6.283; a += .5 / r) {
    const px = Math.round(x + Math.cos(a) * r) + o, py = Math.round(y + Math.sin(a) * r) + o
    g.fillStyle = col
    if (1.6 - e * 1.6 > bayer(px, py)) g.fillRect(px, py, 1, 1)
  }
}

export function tired(g: Ctx, sim: Sim, u: number) {
  const { fly, rest } = sim, x = Math.round(fly.x), y = Math.round(fly.y - fly.h * .7), up = y > 80
  if (u < T.pulse * T.pulses) for (const p of place().perches) ring(g, at(p)[0], at(p)[1], u % T.pulse / T.pulse)
  else if (rest && !fly.perched) chevron(g, at(rest)[0] - 2, at(rest)[1] - 12 - +(u % .8 > .4), 1)
  note(g, T.lines, clamp(Math.round(x - wide / 2), 2, W - wide - 2), up ? y - 30 : y + 22, false, up)
}
