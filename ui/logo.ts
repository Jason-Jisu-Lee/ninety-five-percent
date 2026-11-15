import { ctx, mk, type Ctx } from '../core/canvas'
import { once } from '../core/once'
import { glyph } from './text'

function line(g: Ctx, str: string, x: number, y: number, s: number, top: string, bot: string) {
  const pass = (fn: (px: number, py: number, r: number) => void) => [...str].forEach((ch, n) =>
    glyph(ch).forEach((row, r) => {
      for (let c = 0; c < 5; c++) if (row >> 4 - c & 1) fn(x + (n * 6 + c) * s, y + r * s, r)
    }))
  g.fillStyle = '#0b1716'
  pass((px, py) => g.fillRect(px - 1, py - 1, s + 2, s + 3))
  pass((px, py, r) => {
    g.fillStyle = r < 3 ? top : bot
    g.fillRect(px, py, s, s)
  })
}

export const logo = once(() => {
  const c = mk(220, 54), g = ctx(c)
  line(g, 'BECOMING A', 2, 2, 2, '#c9c0b2', '#8f877b')
  line(g, 'DRAGONFLY', 2, 22, 4, '#ece5d5', '#c9c0b2')
  return c
})
