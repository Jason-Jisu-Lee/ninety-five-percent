import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { cast, PREY } from '../../data/enemies/enemies'
import { text } from '../text/text'

export const ROWS = 6 + cast(1).length

const clock = (s: number) => `${s / 3600 | 0}:${String(s / 60 % 60 | 0).padStart(2, '0')}:${String(s % 60 | 0).padStart(2, '0')}`

export function statistics(g: Ctx, left: number, right: number, top: number) {
  const rows: [string, string | number][] = [
    ['Play time', clock(save.time)], ['Time in control', clock(save.hand)], ['Blood earned', save.earned], ['Upgrades bought', save.bought], ['Deaths', save.deaths],
    ['Enemies caught', Object.values(save.caught).reduce((a, b) => a + b, 0)], ...cast(1).map((k): [string, number] => [PREY[k].many, save.caught[k] ?? 0]),
  ]
  rows.forEach(([name, n], i) => {
    text(g, name, left + (i > 5 ? 8 : 0), top + i * 11, i > 5 ? UI.dim : UI.text)
    text(g, String(n), right, top + i * 11, UI.accent, 'r')
  })
}
