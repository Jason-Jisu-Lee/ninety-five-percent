import { sound } from '../../audio/player/sound'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { note } from '../parts/note'
import { box } from '../parts/panel'
import { text, width } from '../text/text'

const NAME = 'Lair', BW = width(NAME) + 10, X = W - 8 - BW, Y = H - 23

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
      box(g, X, Y + dy, BW, 15, hot ? UI.text : UI.gold, UI.panel)
      text(g, NAME, X + 5, Y + 11 + dy, UI.text)
      if (hot) note(g, ['End this run'], X + BW, Y - 4, true, true)
    },
  }
}
