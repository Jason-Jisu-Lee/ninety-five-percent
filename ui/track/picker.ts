import { pick, playing, tracks } from '../../audio/player/music'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { box } from '../parts/panel'
import { text, width } from '../text/text'

const TOP = 28, ROW = 13

export function picker(right: number) {
  let open = false, hot = -1
  const wide = () => Math.max(...tracks().map(width)) + 14
  const head = (x: number, y: number) => !!playing() && y >= 6 && y < 25 && x < right + 2 && x >= right - width(playing()) - 22
  const row = (x: number, y: number) => open && x >= right - wide() && x < right && y >= TOP + 3 && y < TOP + 3 + tracks().length * ROW ? (y - TOP - 3) / ROW | 0 : -1
  return {
    hover(x: number, y: number) {
      hot = row(x, y)
      return hot >= 0 || head(x, y)
    },
    click(x: number, y: number) {
      const i = row(x, y), was = open
      open = !open && head(x, y)
      if (i >= 0) pick(i)
      return was || open
    },
    draw(g: Ctx) {
      if (!open || !playing()) return void (open = false)
      const names = tracks(), w = wide(), x = right - w
      g.fillStyle = UI.panel
      g.fillRect(x, TOP, w, names.length * ROW + 6)
      names.forEach((name, i) => {
        const y = TOP + 3 + i * ROW
        if (i === hot) box(g, x + 3, y, w - 6, ROW - 1, UI.border, UI.border)
        text(g, name, x + 7, y + 9, i === hot ? UI.panel : name === playing() ? UI.accent : UI.text)
      })
    },
  }
}
