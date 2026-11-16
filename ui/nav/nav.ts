import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { icon } from '../parts/icons'

const Y = 8, S = 17, P = 21

export function nav(acts: (() => void)[]) {
  let hot = -1
  const X = W - 4 - P * acts.length
  const at = (x: number, y: number) => y >= Y && y < Y + S && x >= X && x < X + P * acts.length && (x - X) % P < S ? (x - X) / P | 0 : -1
  return {
    hover: (x: number, y: number) => (hot = at(x, y)) >= 0,
    click(x: number, y: number) {
      const i = at(x, y)
      acts[i]?.()
      return i >= 0
    },
    draw(g: Ctx, paused: boolean, muted: boolean) {
      acts.forEach((_, i) => {
        const pad = i > 1 ? 3 : 4, x = X + i * P + pad, lit = i === hot ? UI.accent : UI.text
        icon(g, i > 1 ? 'gear' : i ? paused ? 'play' : 'pause' : 'note', x, Y + pad, !i && muted ? UI.dim : lit, UI.panel)
        if (!i && muted) icon(g, 'slash', x, Y + pad, lit, UI.panel)
      })
    },
  }
}
