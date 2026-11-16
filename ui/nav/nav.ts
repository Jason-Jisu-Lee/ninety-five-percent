import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { icon } from '../parts/icons'
import { spot } from './smooth'

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
      Object.assign(spot, { x: X, y: Y, n: acts.length, hot, muted })
      if (acts.length > 1) icon(g, paused ? 'play' : 'pause', X + P + 4, Y + 4, hot === 1 ? UI.accent : UI.text, UI.panel)
    },
  }
}
