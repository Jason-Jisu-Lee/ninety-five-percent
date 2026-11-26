import { sound } from '../../audio/player/sound'
import { offered } from '../../core/save/mutate'
import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { MUTATE as M } from '../../data/game/mutations'
import { H } from '../../data/look/screen'
import { note } from '../parts/note'
import { card, GAP, PEEK, RISE } from '../wild/card'
import { CW, X as NEXT } from '../wild/next'

const X = NEXT - CW - GAP

export function offer(buy: () => void) {
  let hot = false
  const on = (x: number, y: number) => offered() && x >= X && x < X + CW && y >= H - PEEK - RISE, can = () => save.blood >= M.cost
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
      const y = card(g, X, CW, [M.name], M.cost, can(), hot)
      if (hot) note(g, [M.say], X, y - 4, false, true)
    },
  }
}
