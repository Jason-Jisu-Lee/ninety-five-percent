import { sound } from '../../audio/player/sound'
import type { Ctx } from '../../core/screen/canvas'
import { RECALL } from '../../data/game/map'
import { LAIR } from '../../data/look/lair'
import { UI } from '../../data/look/palette'
import { H } from '../../data/look/screen'
import { G } from '../../world/game/state'
import { disc, sweep } from '../parts/disc'
import { note } from '../parts/note'

const R = 16, CX = 8 + R, CY = H - 8 - R, LIFT = 11, TIP = ['Return to Lair', 'End this run']
const INK: Record<string, string[]> = { '#': [UI.text, UI.gold], o: [UI.text, UI.gold], s: ['#a8a294', '#8f7642'] }

export const SPOT = [CX, CY, R + 2, R + 2]

export function feastButton(press: () => void, drop: () => void) {
  let hot = false
  const on = (x: number, y: number) => Math.hypot(x - CX, y - CY) < R + 1
  return {
    hover(x: number, y: number) {
      if (on(x, y) && !hot) sound('hover')
      if (hot && !on(x, y)) drop()
      return hot = on(x, y)
    },
    click(x: number, y: number) {
      if (on(x, y)) press()
      return on(x, y)
    },
    lift: drop,
    draw(g: Ctx, dy = 0) {
      const cut = G.cut < RECALL.shake, part = G.cast >= 0 ? G.cast / RECALL.time : cut ? G.part : +(G.lit < RECALL.flash)
      disc(g, CX, CY + dy, R, hot ? UI.gold : UI.line)
      if (part) sweep(g, CX + (cut ? Math.round(Math.sin(G.cut / RECALL.shake * Math.PI * 6) * 2) : 0), CY + dy, R - 1, part, cut ? UI.foe : G.cast < 0 ? '#fff' : UI.text)
      LAIR.forEach((row, j) => [...row].forEach((ch, i) => {
        if (ch === '.') return
        g.fillStyle = INK[ch][+hot]
        for (const x of i ? [CX - i, CX + i] : [CX]) g.fillRect(x, CY + dy - LIFT + j, 1, 1)
      }))
      if (hot) note(g, TIP, CX - R, CY - R - 4, false, true)
    },
  }
}
