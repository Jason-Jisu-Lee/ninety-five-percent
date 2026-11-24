import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'

const HOP = [-2, -4, -4, -2, 0, 1], LINES = .28, tmp = ctx(mk(W, H))

export function pop(g: Ctx, u: number, draw: (g: Ctx, dy: number) => void, [cx, cy, rx, ry]: number[] = [574, 45, 64, 17]) {
  const f = Math.floor(u * 30), dy = HOP[f] ?? 0, e = u / LINES, far = 1 - (1 - e) ** 2
  if (f < 2) {
    tmp.clearRect(0, 0, W, H)
    draw(tmp, dy)
    tmp.globalCompositeOperation = 'source-in'
    tmp.fillStyle = '#fff'
    tmp.fillRect(0, 0, W, H)
    tmp.globalCompositeOperation = 'source-over'
    g.drawImage(tmp.canvas, 0, 0)
  } else draw(g, dy)
  if (e < 1) for (let i = 0; i < 12; i++) {
    const a = i / 12 * 6.283 + .26, c = Math.cos(a), s = Math.sin(a), n = Math.hypot(c / rx, s / ry)
    for (const [col, o] of [[UI.panel, 1], [UI.text, 0]] as const) for (let j = 0; j < 7 * (1 - e); j++) {
      g.fillStyle = col
      g.fillRect(Math.round(cx + c * (rx + 2) + c / rx / n * (far * 16 + j)) + o, Math.round(cy + s * (ry + 2) + s / ry / n * (far * 16 + j)) + o, 1, 1)
    }
  }
}
