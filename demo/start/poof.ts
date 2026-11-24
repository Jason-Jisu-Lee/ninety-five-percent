import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { questAt } from './quest'
import { disc } from './stamp'

const CX = 574, CY = 45, LEFT = 512, tmp = ctx(mk(W, H))
const CLOUD = [[-47, 1, 9], [-31, -6, 13], [-11, -10, 10], [9, -6, 14], [31, -9, 10], [49, -1, 8], [-37, 9, 8], [-17, 8, 12], [5, 10, 9], [25, 8, 12], [43, 9, 7]]
const DUST = [[0, -8, 5], [-3, 0, 6], [0, 8, 5], [8, 13, 4], [9, -12, 4]]

function puffs(g: Ctx, list: number[][]) {
  for (const [x, y, r] of list) if (r > 0) disc(g, x, y, r + 1, UI.panel)
  for (const [x, y, r] of list) if (r > 0) disc(g, x, y, r, UI.border)
  for (const [x, y, r] of list) if (r > 1) disc(g, x - 1, y - 1, r - 1, UI.text)
}

export const POOFS: { name: string; note: string; draw(g: Ctx, u: number, got: number): void }[] = [
  {
    name: 'Smoke puff',
    note: 'A small cloud bursts where the quest goes and clears to show it. 0.6 s',
    draw(g, u, got) {
      const s = Math.floor(u * 20) / 20, e = Math.min(1, Math.max(0, s - .1) / .5), in0 = Math.min(1, s / .1), wide = (.3 + .7 * in0) * (1 + .3 * e)
      if (u < 0) return
      if (s >= .1) questAt(g, got)
      puffs(g, CLOUD.map(([x, y, r], i) => [Math.round(CX + x * wide), Math.round(CY + y * wide - 7 * e), Math.round(r * (.6 + .5 * in0) * Math.max(0, 1 - e * (1.1 + i % 3 * .35)))]))
    },
  },
  {
    name: 'Pop',
    note: 'The quest flashes white, hops, and short lines shoot outward. 0.3 s',
    draw(g, u, got) {
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
    },
  },
  {
    name: 'Slide and dust',
    note: 'The quest shoots in from the right edge, stops hard and kicks up dust. 0.5 s',
    draw(g, u, got) {
      const IN = .16, f = Math.floor((u - IN) * 30), e = Math.min(1, Math.max(0, u - IN) / .4), far = 1 - (1 - e) ** 2
      if (u < 0) return
      questAt(g, got, u < IN ? Math.round(150 * (1 - (u / IN) ** 2)) : [-4, -2, 1][f] ?? 0)
      if (u >= IN && e < 1) puffs(g, DUST.map(([x, y, r]) => [Math.round(LEFT - 4 - x - (18 + x) * far), Math.round(CY + y * (1 + .5 * far) - 3 * far), Math.round(r * (1 - e))]))
    },
  },
]
