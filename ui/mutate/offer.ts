import { sound } from '../../audio/player/sound'
import { offered } from '../../core/save/mutate'
import { afford } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { MUTATE as M } from '../../data/game/mutations'
import { H } from '../../data/look/screen'
import { note } from '../parts/note'
import { card, GAP, PEEK, RISE } from '../wild/card'
import { CW, spot } from '../wild/next'

export function offer(buy: () => void) {
  let hot = false
  const left = () => spot() - CW - GAP, on = (x: number, y: number) => offered() && x >= left() && x < left() + CW && y >= H - PEEK - RISE, can = () => afford(M.cost)
  return {
    hover(x: number, y: number) {
      const was = hot
      hot = on(x, y)
      if (hot && !was) sound('tap')
      return hot && can()
    },
    click(x: number, y: number) {
      const hit = on(x, y)
      if (hit) buy()
      return hit
    },
    draw(g: Ctx) {
      if (!offered()) return
      const y = card(g, left(), CW, [M.name], M.cost, can(), hot)
      if (hot) note(g, [M.say], left(), y - 4, false, true)
    },
  }
}
