import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import type { Style } from './styles'

export function paint(g: Ctx, s: Style, x: number, y: number) {
  for (const d of s.shade ? [1, 0] : [0]) s.art.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (s.inks[row[i]]) {
      g.fillStyle = d ? UI.panel : s.inks[row[i]]
      g.fillRect(x + i + d, y + j + d, 1, 1)
    }
  })
}

export function image(s: Style, scale: number) {
  const w = Math.max(...s.art.map(r => r.length)) + 1, h = s.art.length + 1, k = Math.ceil(scale), one = ctx(mk(w, h)), big = ctx(mk(w * k, h * k)), out = ctx(mk(Math.ceil(w * scale), Math.ceil(h * scale)))
  paint(one, s, 0, 0)
  big.imageSmoothingEnabled = false
  big.drawImage(one.canvas, 0, 0, w * k, h * k)
  out.drawImage(big.canvas, 0, 0, w * scale, h * scale)
  return `url(${out.canvas.toDataURL()}) ${Math.round(s.hot[0] * scale)} ${Math.round(s.hot[1] * scale)}, auto`
}
