import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { dissolve, veil } from '../../core/draw/dissolve'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { text } from '../text/text'

const PAGES = [
  ['Dragonflies are said to catch', '95 percent of what they hunt.'],
  ['The deadliest hunter alive', 'feeds on gnats.'],
  ['It was not always so.', 'Once their kind ruled the sky,', 'and 95 percent meant', 'every living creature.'],
  ['The giants are gone.', 'The hunger never left.'],
  ['Start small.', 'Take back the sky.'],
]
const IN = .6, PAGE = 4.4, EDGE = .7, END = IN + PAGES.length * PAGE

export function intro(done: () => void) {
  const layer = ctx(mk(W, H))
  let t = -1, shown = -1
  return {
    on: () => t >= 0,
    begin() {
      t = 0
    },
    next() {
      if (t > IN && t < END) t = IN + (Math.floor((t - IN) / PAGE) + 1) * PAGE
    },
    skip() {
      if (t < END) t = END
    },
    update(dt: number) {
      if (t < 0) return
      const was = t
      t += dt
      if (was < END && t >= END) done()
      if (t >= END + IN) t = -1
    },
    draw(g: Ctx) {
      if (t < 0) return
      const i = Math.floor((t - IN) / PAGE), u = (t - IN) % PAGE
      veil(g, t < IN ? t / IN : t > END ? 1 - (t - END) / IN : 1)
      if (t < IN || t >= END) return
      if (i !== shown) {
        shown = i
        layer.clearRect(0, 0, W, H)
        PAGES[i].forEach((line, j) => text(layer, line, W / 2, H / 2 + 14 + (j - PAGES[i].length / 2) * 22, UI.text, 'c', undefined, 2))
      }
      dissolve(g, layer.canvas, 0, 0, Math.min(1, u / EDGE, (PAGE - u) / EDGE))
    },
  }
}
