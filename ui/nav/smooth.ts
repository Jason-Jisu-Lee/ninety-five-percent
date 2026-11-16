import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'

type Part = [draw: (g: Ctx) => void, line?: number]

const TAU = Math.PI * 2

export const spot = { x: 0, y: 0, n: 0, hot: -1, muted: false }

function ink(g: Ctx, col: string, parts: Part[]) {
  g.lineCap = g.lineJoin = 'round'
  for (const [c, more] of [[UI.panel, 2], [col, 0]] as const) for (const [draw, line = 0] of parts) {
    g.beginPath()
    draw(g)
    g.strokeStyle = g.fillStyle = c
    g.lineWidth = line + more
    if (line || more) g.stroke()
    if (!line) g.fill('evenodd')
  }
}

const line = (x0: number, y0: number, x1: number, y1: number, wide: number): Part => [g => {
  g.moveTo(x0, y0)
  g.lineTo(x1, y1)
}, wide]

const cog = (x: number, y: number): Part => [g => {
  for (let i = 0; i < 6; i++) for (const [rad, off] of [[3.9, -.38], [5.6, -.25], [5.6, .25], [3.9, .38]])
    g.lineTo(x + 8.5 + Math.cos(i * TAU / 6 + off) * rad, y + 8.5 + Math.sin(i * TAU / 6 + off) * rad)
  g.closePath()
  g.moveTo(x + 10.2, y + 8.5)
  g.arc(x + 8.5, y + 8.5, 1.7, 0, TAU)
}]

const note = (x: number, y: number): Part[] => [
  [g => g.ellipse(x + 6.9, y + 11.8, 2.3, 1.75, -.35, 0, TAU)],
  line(x + 8.95, y + 11.4, x + 8.95, y + 3.7, 1.25),
  [g => {
    g.moveTo(x + 8.95, y + 3.7)
    g.bezierCurveTo(x + 9.8, y + 5.6, x + 12.6, y + 5.4, x + 12, y + 8.2)
  }, 1.25],
]

export function smooth(g: Ctx) {
  const { x, y, n, hot, muted } = spot, col = (i: number) => i === hot ? UI.accent : UI.text
  ink(g, col(0), note(x, y))
  if (muted) ink(g, col(0), [line(x + 3.3, y + 3.3, x + 13.7, y + 13.7, 1.4)])
  if (n > 2) ink(g, col(2), [cog(x + 42, y)])
}
