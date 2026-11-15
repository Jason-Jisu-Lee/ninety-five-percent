import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { W } from '../data/look/screen'
import { ring } from '../ui/parts/ring'
import { text } from '../ui/text/text'

const NAMES = ['Ground ring', 'Corner marks', 'Cursor target', 'Mode word']
let pick = 1

export function signKey(k: string) {
  if (!'1234'.includes(k)) return false
  pick = +k
  return true
}

export function drawSign(g: Ctx, sel: boolean, x: number, y: number, sx: number, sy: number, cursor: number[]) {
  text(g, `${pick} ${NAMES[pick - 1]}`, W / 2, 352, UI.text, 'c', UI.panel)
  if (pick === 4) text(g, sel ? 'Manual' : 'Auto', 88, 19, sel ? UI.accent : UI.dim, undefined, UI.panel)
  if (!sel) return
  g.fillStyle = UI.text
  if (pick === 1) ring(g, sx, sy, 14, UI.text)
  if (pick === 2) for (const a of [-1, 1]) for (const b of [-1, 1]) {
    g.fillRect(x + a * 15 - (a > 0 ? 3 : 0), y + b * 15, 4, 1)
    g.fillRect(x + a * 15, y + b * 15 - (b > 0 ? 3 : 0), 1, 4)
  }
  if (pick === 3) {
    ring(g, Math.round(cursor[0]), Math.round(cursor[1]), 5, UI.text)
    g.fillRect(Math.round(cursor[0]), Math.round(cursor[1]), 1, 1)
  }
}
