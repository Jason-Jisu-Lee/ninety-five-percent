import type { Ctx } from '../core/canvas'
import { UI } from '../data/palette'
import { bar } from './bar'
import { text } from './text'

export function hatchBar(g: Ctx, name: string, prog: number, layer: number) {
  text(g, name, 386, 40, 12, UI.text, 'c')
  bar(g, 226, 48, 320, 2, prog, '#0b1716', UI.yolk, '#f3dc9c')
  for (let i = 0; i < 5; i++) {
    g.fillStyle = i <= layer ? UI.yolk : '#3a352e'
    g.fillRect(364 + i * 10, 56, 4, 4)
    g.fillStyle = '#0b1716'
    g.fillRect(365 + i * 10, 57, 2, 2)
  }
}
