import type { Ctx } from '../../core/screen/canvas'
import { WING } from '../../data/dragonfly/colors'
import { FOREST as C, UI } from '../../data/look/palette'
import { text } from '../../ui/text/text'

export function effects() {
  let nums: { x: number; y: number; s: string; col: string; age: number }[] = [], bits: { x: number; y: number; h: number; vx: number; age: number; n: number }[] = []
  return {
    hit: (x: number, y: number, s: string, col = UI.text) => nums.push({ x, y, s, col, age: 0 }),
    shed(x: number, y: number, h: number, n: number) {
      for (const s of [-1, 1]) bits.push({ x: x + s * 2, y, h, vx: s * (8 + Math.random() * 10), age: 0, n })
    },
    step(dt: number) {
      for (const n of nums) n.age += dt
      for (const b of bits) {
        if (b.h <= 0) b.age += dt
        else {
          b.h = Math.max(0, b.h - 22 * dt)
          b.x += b.vx * dt
        }
      }
      nums = nums.filter(n => n.age < .7)
      bits = bits.filter(b => b.age < 4)
    },
    litter(g: Ctx) {
      for (const b of bits) {
        g.fillStyle = C.deep
        if (b.h > 0) g.fillRect(Math.round(b.x + b.h * .45), Math.round(b.y), b.n, 1)
        g.fillStyle = WING.fill
        g.fillRect(Math.round(b.x), Math.round(b.y - b.h * .7), b.n, 1)
      }
    },
    numbers(g: Ctx) {
      for (const n of nums) text(g, n.s, Math.round(n.x), Math.round(n.y - n.age * 22), n.col, 'c', UI.panel)
    },
  }
}
