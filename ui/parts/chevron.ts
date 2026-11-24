import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'

const V = [[0, 0], [1, 1], [2, 2], [3, 1], [4, 0]]

export function chevron(g: Ctx, x: number, y: number, way: number) {
  for (let n = 0; n < 10; n++) {
    g.fillStyle = n < 9 ? UI.panel : UI.text
    for (const [i, j] of V) g.fillRect(x + i + (n < 9 ? n % 3 - 1 : 0), y + j * way + (n < 9 ? (n / 3 | 0) - 1 : 0), 1, 1)
  }
}
