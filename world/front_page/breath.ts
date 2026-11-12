import type { Ctx } from '../../core/canvas'
import { UI } from '../../data/palette'
import { bubble } from '../bubble'
import { EX, EY } from './egg'

export function breath() {
  let last = 0, list: { x: number; y: number; a: number; big: boolean }[] = []
  return {
    step(t: number) {
      if (t - last > 5) {
        last = t
        list.push({ x: EX - 6, y: EY - 6, a: 0, big: false }, { x: EX - 3, y: EY - 8, a: -.6, big: true })
      }
      list = list.filter(q => q.a < 3.2)
      for (const q of list) q.a += .1
    },
    draw(g: Ctx) {
      for (const q of list) {
        if (q.a < 0) continue
        const x = Math.round(q.x - q.a * 4), y = Math.round(q.y - q.a * 9)
        if (q.big) bubble(g, x, y)
        else {
          g.fillStyle = UI.glint
          g.fillRect(x, y, 1, 1)
        }
      }
    },
  }
}
