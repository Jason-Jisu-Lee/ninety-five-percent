import { sound } from '../../audio/player/sound'
import type { Ctx } from '../../core/screen/canvas'
import { LAIR } from '../../data/look/lair'
import { UI } from '../../data/look/palette'
import { H } from '../../data/look/screen'
import { disc } from '../parts/disc'
import { note } from '../parts/note'

const R = 16, CX = 8 + R, CY = H - 8 - R, LIFT = 11, TIP = ['Return to Lair', 'End this run']
const INK: Record<string, string[]> = { '#': [UI.text, UI.gold], o: [UI.text, UI.gold], '+': ['#77756a', '#6b5a35'], s: ['#a8a294', '#8f7642'] }

export const SPOT = [CX, CY, R + 2, R + 2]

export function feastButton(run: () => void) {
  let hot = false
  const on = (x: number, y: number) => Math.hypot(x - CX, y - CY) < R + 1
  return {
    hover(x: number, y: number) {
      if (on(x, y) && !hot) sound('hover')
      return hot = on(x, y)
    },
    click(x: number, y: number) {
      if (on(x, y)) run()
      return on(x, y)
    },
    draw(g: Ctx, dy = 0) {
      disc(g, CX, CY + dy, R, hot ? UI.gold : UI.line)
      LAIR.forEach((row, j) => [...row].forEach((ch, i) => {
        if (ch === '.') return
        g.fillStyle = INK[ch][+hot]
        for (const x of i ? [CX - i, CX + i] : [CX]) g.fillRect(x, CY + dy - LIFT + j, 1, 1)
      }))
      if (hot) note(g, TIP, CX - R, CY - R - 4, false, true)
    },
  }
}
