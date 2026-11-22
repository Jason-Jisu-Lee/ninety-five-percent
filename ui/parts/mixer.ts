import { mix, toggle } from '../../audio/player/music'
import { save } from '../../core/save/save'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { text } from '../text/text'
import { box } from './panel'

const ROWS = [['Music', 'vol'], ['Effects', 'fx']] as const, BAR = 44, PITCH = 13

export const mixer = {
  w: BAR + 80, h: PITCH * 2 + 9,
  on: (x: number, y: number, left: number, top: number) => x >= left - 2 && x < left + mixer.w && y >= top - 2 && y < top + mixer.h + 2,
  click(x: number, y: number, left: number, top: number) {
    const row = Math.floor((y - top + 2) / PITCH)
    if (!mixer.on(x, y, left, top)) return false
    if (ROWS[row] && x >= left + BAR - 4) mix(ROWS[row][1], Math.ceil((x - left - BAR - 2) / 8))
    else if (row === 2) toggle()
    return true
  },
  draw(g: Ctx, left: number, top: number) {
    ROWS.forEach(([label, key], i) => {
      text(g, label, left, top + i * PITCH + 8, UI.text)
      for (let j = 0; j < 10; j++) box(g, left + BAR + j * 8, top + i * PITCH, 6, 9, !save.mute && j < save[key] ? UI.accent : UI.dim, !save.mute && j < save[key] ? UI.accent : UI.panel)
    })
    box(g, left, top + PITCH * 2, 9, 9, UI.border, save.mute ? UI.accent : UI.panel)
    text(g, 'Mute all', left + 14, top + PITCH * 2 + 8, UI.text)
  },
}
