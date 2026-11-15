import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { PREY } from '../../data/stage1/enemies'
import { text } from '../text/text'

export const ROWS = 5 + Object.keys(PREY).length

const clock = (s: number) => `${s / 3600 | 0}:${String(s / 60 % 60 | 0).padStart(2, '0')}:${String(s % 60 | 0).padStart(2, '0')}`

export function statistics(g: Ctx, left: number, right: number, top: number) {
  const rows: [string, string | number][] = [
    ['Play time', clock(save.time)], ['Time in control', clock(save.hand)], ['Energy earned', save.earned], ['Upgrades bought', save.bought],
    ['Enemies caught', Object.values(save.caught).reduce((a, b) => a + b, 0)], ...Object.entries(PREY).map(([k, p]): [string, number] => [p.many, save.caught[k] ?? 0]),
  ]
  rows.forEach(([name, n], i) => {
    text(g, name, left + (i > 4 ? 8 : 0), top + i * 11, i > 4 ? UI.dim : UI.text)
    text(g, String(n), right, top + i * 11, UI.accent, 'r')
  })
}
