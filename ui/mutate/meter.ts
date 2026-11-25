import { morph, need } from '../../core/save/mutate'
import type { Ctx } from '../../core/screen/canvas'
import { ORB } from '../../data/look/palette'
import { gauge } from '../parts/bar'
import { note } from '../parts/note'

const X = 14, Y = 31, WIDE = 64

export function meter() {
  let hot = false
  return {
    hover(x: number, y: number) {
      hot = morph.on && x >= X - 2 && x < X + WIDE + 2 && y >= Y - 3 && y < Y + 7
      return false
    },
    click: () => false,
    draw(g: Ctx) {
      if (!morph.on) return
      gauge(g, X, Y, WIDE, morph.fed / need(), ORB['#'])
      if (hot) note(g, [`${Math.floor(Math.min(morph.fed, need()))} / ${need()} Lifeblood`], X + WIDE + 6, Y - 8)
    },
  }
}
