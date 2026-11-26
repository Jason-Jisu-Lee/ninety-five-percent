import { sound } from '../../audio/player/sound'
import { offered } from '../../core/save/mutate'
import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { MUTATE as M } from '../../data/game/mutations'
import { note } from '../parts/note'
import { SLOTS } from '../wild/next'
import { slot, TALL } from '../wild/slot'

const [X, , WIDE] = SLOTS, Y = SLOTS[1] - 19

export function offer(buy: () => void) {
  let hot = false
  const on = (x: number, y: number) => offered() && x >= X && x < X + WIDE && y >= Y && y < Y + TALL, can = () => save.blood >= M.cost
  return {
    hover(x: number, y: number) {
      const was = hot
      hot = on(x, y)
      if (hot && !was) sound('tap')
      return hot && can()
    },
    click(x: number, y: number) {
      if (on(x, y)) buy()
      return on(x, y)
    },
    draw(g: Ctx) {
      if (!offered()) return
      slot(g, M.name, M.cost, X, Y, WIDE, can(), hot)
      if (hot) note(g, [M.say], X, Y - 4, false, true)
    },
  }
}
