import type { Ctx } from '../core/canvas'
import { UI } from '../data/palette'
import { box } from './panel'
import { text } from './text'

const LOOK: Record<string, string[]> = {
  ready: ['Respire', UI.accent, UI.accent, '#141a12'],
  active: ['Respiring', UI.text, '#5c564c', '#0f0c0a', '#1d2a1c'],
  cooldown: ['Respire', '#5c564c', '#2a2520', '#0f0c0a', '#17140f'],
}

export function respireButton(g: Ctx, x: number, y: number, phase: string, fill: number) {
  const [label, ink, border, back, sweep] = LOOK[phase]
  box(g, x, y, 140, 26, border, back)
  if (sweep) {
    g.fillStyle = sweep
    g.fillRect(x + 1, y + 1, Math.round(138 * fill), 24)
  }
  text(g, label, x + 70, y + 17, 12, ink, 'c')
}
