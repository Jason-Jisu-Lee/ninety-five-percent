import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { dissolve, veil } from '../../core/draw/dissolve'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { text } from '../text/text'

const PAGE = 4.4, EDGE = .7

export function story(pages: string[][], done: () => void, lead = .6, back = .6) {
  const layer = ctx(mk(W, H)), END = lead + pages.length * PAGE
  let t = -1, shown = -1, due = false
  return {
    on: () => t >= 0,
    begin() {
      t = 0
      due = true
    },
    next() {
      if (t > lead && t < END) t = lead + (Math.floor((t - lead) / PAGE) + 1) * PAGE
    },
    skip() {
      if (t < END) t = END
    },
    update(dt: number) {
      if (t < 0) return
      t += dt
      if (due && t >= END) {
        due = false
        done()
      }
      if (t >= END + back) t = -1
    },
    draw(g: Ctx) {
      if (t < 0) return
      const i = Math.floor((t - lead) / PAGE), u = (t - lead) % PAGE
      veil(g, t < lead ? t / lead : t > END ? 1 - (t - END) / back : 1)
      if (t < lead || t >= END) return
      if (i !== shown) {
        shown = i
        layer.clearRect(0, 0, W, H)
        pages[i].forEach((line, j) => text(layer, line, W / 2, H / 2 + 14 + (j - pages[i].length / 2) * 22, UI.text, 'c', undefined, 2))
      }
      dissolve(g, layer.canvas, 0, 0, Math.min(1, u / EDGE, (PAGE - u) / EDGE))
    },
  }
}
