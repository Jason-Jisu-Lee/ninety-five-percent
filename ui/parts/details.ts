import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { text, width } from '../text/text'
import { wrap } from '../text/wrap'
import { box, panel } from './panel'

export type Details = { name: string; col: string; about: string; rows: [string, string, string?][]; skills: [string, string][] }

export const DW = 200
const IN = 12, SEE = .84, GAP = 12, sheet = ctx(mk(DW, H))

function tip(g: Ctx, lines: string[], x: number, y: number) {
  const w = Math.max(...lines.map(l => width(l))) + 10, left = Math.min(x, W - w - 2)
  box(g, left, y, w, lines.length * 11 + 7, UI.border, UI.panel)
  lines.forEach((l, i) => text(g, l, left + 5, y + 12 + i * 11, UI.text))
}

export function details(g: Ctx, d: Details, at: (tall: number) => number[], mx = -1, my = -1) {
  const about = wrap(d.about, DW - IN * 2), words: [string, string, number, number][] = []
  let wx = 0, wy = 0
  for (const [n, say] of d.skills) {
    if (wx && wx + width(n) > DW - IN * 2) [wx, wy] = [0, wy + GAP]
    words.push([n, say, wx, wy])
    wx += width(n) + GAP
  }
  const tall = 62 + about.length * 11 + d.rows.length * 12 + (words.length ? 28 + wy : 0), [x, top] = at(tall)
  sheet.clearRect(0, 0, DW, H)
  panel(sheet, 0, 0, DW, tall, UI.border, UI.panel)
  g.globalAlpha = SEE
  g.drawImage(sheet.canvas, 0, 0, DW, tall, x, top, DW, tall)
  g.globalAlpha = 1
  text(g, d.name, x + IN, top + 24, d.col, undefined, undefined, 2)
  let y = top + 43, hover: [string[], number, number] | null = null
  const rule = () => {
    g.fillStyle = UI.line
    g.fillRect(x + IN, y - 6, DW - IN * 2, 1)
    y += 8
  }
  for (const line of about) text(g, line, x + IN, (y += 11) - 11, UI.text)
  y += 6
  rule()
  d.rows.forEach(([n, v, say], i) => {
    const ry = y + i * 12, hot = !!say && mx >= x + IN && mx < x + DW - IN && my >= ry - 9 && my < ry + 3
    if (hot) hover = [[say], mx + 6, my + 8]
    text(g, n, x + IN, ry, hot ? UI.accent : UI.text)
    text(g, v, x + DW - IN, ry, UI.text, 'r')
  })
  y += d.rows.length * 12 + 2
  if (words.length) {
    y += 6
    rule()
    for (const [n, say, ox, oy] of words) {
      const sx = x + IN + ox, sy = y + oy, hot = mx >= sx - 2 && mx < sx + width(n) + 2 && my >= sy - 9 && my < sy + 3
      text(g, n, sx, sy, hot ? UI.text : UI.gold)
      if (hot) hover = [wrap(say, 150), sx - 5, sy + 6]
    }
  }
  if (hover) tip(g, ...hover)
  return [x, top, tall]
}
