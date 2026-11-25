import { sound } from '../../audio/player/sound'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { note } from '../parts/note'
import { soft } from '../parts/panel'
import { text } from '../text/text'
import { SLOTS } from '../wild/next'

const NAME = 'Return to Lair', [X, , BW] = SLOTS, Y = SLOTS[1] - 19

export const SPOT = [X + BW / 2, Y + 8, BW / 2 + 2, 9]

export function feastButton(run: () => void) {
  let hot = false
  const on = (x: number, y: number) => x >= X && x < X + BW && y >= Y && y < Y + 15
  return {
    hover(x: number, y: number) {
      if (on(x, y) && !hot) sound('hover')
      return hot = on(x, y)
    },
    click(x: number, y: number) {
      if (on(x, y)) run()
      return on(x, y)
    },
    draw(g: Ctx, dy = 0) {
      soft(g, X, Y + dy, BW, 15, hot ? UI.gold : UI.line)
      text(g, NAME, X + BW / 2, Y + 11 + dy, hot ? UI.gold : UI.text, 'c')
      if (hot) note(g, ['End this run'], X, Y, false, true)
    },
  }
}
