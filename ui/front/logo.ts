import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { once } from '../../core/math/once'
import { glyph } from '../text/text'

function line(g: Ctx, str: string, x: number, y: number, s: number) {
  for (const [col, d] of [['#0b1716', 2], ['#ece5d5', 0]] as const) {
    g.fillStyle = col
    ;[...str].forEach((ch, n) => glyph(ch).forEach((row, r) => {
      for (let c = 0; c < 5; c++) if (row >> 4 - c & 1) g.fillRect(x + (n * 6 + c) * s + d, y + r * s + d, s, s)
    }))
  }
}

export const logo = once(() => {
  const c = mk(204, 64), g = ctx(c)
  line(g, 'NINETY-FIVE', 2, 2, 3)
  line(g, 'PERCENT', 2, 34, 3)
  return c
})
