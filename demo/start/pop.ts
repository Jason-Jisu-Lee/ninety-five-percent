import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { questAt } from './quest'

const CX = 574, CY = 45, tmp = ctx(mk(W, H))

export function pop(g: Ctx, u: number, got: number) {
  const f = Math.floor(u * 30), dy = [-2, -4, -4, -2, 0, 1][f] ?? 0, e = u / .28
  if (u < 0) return
  if (f < 2) {
    tmp.clearRect(0, 0, W, H)
    questAt(tmp, got, 0, dy)
    tmp.globalCompositeOperation = 'source-in'
    tmp.fillStyle = '#fff'
    tmp.fillRect(0, 0, W, H)
    tmp.globalCompositeOperation = 'source-over'
    g.drawImage(tmp.canvas, 0, 0)
  } else questAt(g, got, 0, dy)
  if (e < 1) for (let i = 0; i < 12; i++) {
    const a = i / 12 * 6.283 + .26, c = Math.cos(a), s = Math.sin(a), n = Math.hypot(c / 64, s / 17), far = 1 - (1 - e) ** 2
    for (const [col, o] of [[UI.panel, 1], [UI.text, 0]] as const) for (let j = 0; j < 7 * (1 - e); j++) {
      g.fillStyle = col
      g.fillRect(Math.round(CX + c * 66 + c / 64 / n * (far * 16 + j)) + o, Math.round(CY + s * 19 + s / 17 / n * (far * 16 + j)) + o, 1, 1)
    }
  }
}
