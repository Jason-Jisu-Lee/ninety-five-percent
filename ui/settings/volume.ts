import { toggle, tune } from '../../audio/player/music'
import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { icon } from '../parts/icons'
import { box } from '../parts/panel'

const level = () => save.music ? save.vol : 0

export const volume = {
  at: (x: number, y: number, left: number, top: number) => y < top - 2 || y >= top + 11 || x < left || x >= left + 96 ? -1 : x < left + 16 ? 0 : (x - left - 16) / 8 + 1 | 0,
  set: (v: number) => v ? tune(v) : toggle(),
  nudge: (d: number) => tune(Math.max(0, Math.min(10, level() + d))),
  draw(g: Ctx, left: number, top: number) {
    const on = level()
    icon(g, 'note', left, top, on ? UI.text : UI.dim)
    if (!on) icon(g, 'slash', left, top, UI.text)
    for (let i = 0; i < 10; i++) box(g, left + 16 + i * 8, top, 6, 9, i < on ? UI.accent : UI.dim, i < on ? UI.accent : UI.panel)
  },
}
