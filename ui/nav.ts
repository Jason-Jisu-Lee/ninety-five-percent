import type { Ctx } from '../core/canvas'
import { UI } from '../data/palette'
import { W } from '../data/screen'
import { icon } from './icons'
import { box } from './panel'

const X = W - 67, Y = 8, S = 17, P = 21

export function nav(acts: (() => void)[]) {
  let hot = -1
  const at = (x: number, y: number) => y >= Y && y < Y + S && x >= X && x < X + P * acts.length && (x - X) % P < S ? (x - X) / P | 0 : -1
  return {
    hover: (x: number, y: number) => (hot = at(x, y)) >= 0,
    click(x: number, y: number) {
      const i = at(x, y)
      acts[i]?.()
      return i >= 0
    },
    draw(g: Ctx, paused: boolean, muted: boolean) {
      for (let i = 0; i < 3; i++) {
        const x = X + i * P
        box(g, x, Y, S, S, i === hot ? UI.accent : UI.border, UI.panel)
        icon(g, i > 1 ? 'gear' : i ? 'note' : paused ? 'play' : 'pause', x + 4, Y + 4, i === 1 && muted ? UI.dim : UI.text)
        if (i === 1 && muted) icon(g, 'slash', x + 4, Y + 4, UI.text)
      }
    },
  }
}
