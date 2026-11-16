import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { FOREST as C, UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { EVOLVE } from '../../data/shop/evolve'
import { drop } from '../parts/icons'
import { note } from '../parts/note'
import { box } from '../parts/panel'
import { text, width } from '../text/text'

const BW = width('Evolve') + width(String(EVOLVE.cost)) + 27, X = W - 8 - BW, Y = H - 23

export function evolveButton(run: () => void) {
  let hot = false
  const on = (x: number, y: number) => x >= X && x < X + BW && y >= Y && y < Y + 15, can = () => save.blood >= EVOLVE.cost
  return {
    hover: (x: number, y: number) => (hot = on(x, y)) && can(),
    click(x: number, y: number) {
      if (on(x, y) && can()) run()
      return on(x, y)
    },
    draw(g: Ctx) {
      const ok = can()
      box(g, X, Y, BW, 15, !ok ? UI.dim : hot ? UI.text : UI.gold, UI.panel)
      text(g, 'Evolve', X + 5, Y + 11, ok ? UI.text : UI.dim)
      drop(g, X + BW - width(String(EVOLVE.cost)) - 9, Y + 7, ok ? C.red : UI.dim)
      text(g, String(EVOLVE.cost), X + BW - 4, Y + 11, ok ? UI.text : UI.dim, 'r')
      if (hot) note(g, ['Resets this run', `Evolution points gained: ${EVOLVE.points}`], X + BW, Y - 4, true, true)
    },
  }
}
