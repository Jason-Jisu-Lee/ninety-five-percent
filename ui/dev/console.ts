import { clamp } from '../../core/math/clamp'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { box } from '../parts/panel'
import { text } from '../text/text'

export type Tool = [label: () => string, run: () => void]

const COLS = 4, CW = 44, CH = 13, GAP = 2, PAD = 3, BAR = 9, FOLD = 11, SMALL = 28, SEE = .5, KEY = 'ninety-five-percent-console', sheet = ctx(mk(W, H))

export function devConsole(tools: Tool[]) {
  const full = [COLS * (CW + GAP) - GAP + PAD * 2, BAR + Math.ceil(tools.length / COLS) * (CH + GAP) + PAD - GAP + 1]
  const s = { x: 8, y: H - 8 - full[1], small: false }
  let hot = -1, grip = false, fold = false, held: number[] | undefined
  try {
    Object.assign(s, JSON.parse(localStorage.getItem(KEY) ?? '{}'))
  } catch {}
  const wide = () => s.small ? SMALL : full[0], tall = () => s.small ? BAR + 1 : full[1], cell = (i: number) => [s.x + PAD + i % COLS * (CW + GAP), s.y + BAR + (i / COLS | 0) * (CH + GAP)]
  const on = (x: number, y: number) => tools.length > 0 && x >= s.x && x < s.x + wide() && y >= s.y && y < s.y + tall()
  const at = (x: number, y: number) => s.small ? -1 : tools.findIndex((_, i) => x >= cell(i)[0] && x < cell(i)[0] + CW && y >= cell(i)[1] && y < cell(i)[1] + CH)
  const keep = () => {
    ;[s.x, s.y] = [clamp(s.x, 0, W - wide()), clamp(s.y, 0, H - tall())]
    localStorage.setItem(KEY, JSON.stringify(s))
  }
  return {
    hover(x: number, y: number) {
      if (held) [s.x, s.y] = [clamp(Math.round(x - held[0]), 0, W - wide()), clamp(Math.round(y - held[1]), 0, H - tall())]
      grip = !!held || on(x, y) && y < s.y + BAR
      fold = grip && !held && x < s.x + FOLD
      hot = held ? -1 : at(x, y)
      return !!held || on(x, y)
    },
    click(x: number, y: number) {
      if (!on(x, y)) return false
      if (y >= s.y + BAR) tools[at(x, y)]?.[1]()
      else if (x < s.x + FOLD) s.small = !s.small, keep()
      else held = [x - s.x, y - s.y]
      return true
    },
    lift() {
      if (held) keep()
      held = undefined
    },
    draw(g: Ctx) {
      if (!tools.length) return
      const w = wide(), t = tall(), mark = fold ? UI.accent : UI.text
      sheet.clearRect(s.x, s.y, full[0], full[1])
      box(sheet, s.x, s.y, w, t, UI.dim, UI.panel)
      sheet.fillStyle = mark
      sheet.fillRect(s.x + 3, s.y + 4, 5, 1)
      if (s.small) sheet.fillRect(s.x + 5, s.y + 2, 1, 5)
      sheet.fillStyle = grip && !fold ? UI.accent : UI.dim
      for (const dy of [3, 5]) sheet.fillRect(s.x + FOLD + 1, s.y + dy, w - FOLD - 5, 1)
      if (!s.small) tools.forEach(([label], i) => {
        const [x, y] = cell(i)
        box(sheet, x, y, CW, CH, i === hot ? UI.accent : UI.dim, UI.panel)
        text(sheet, label(), x + CW / 2, y + 10, UI.text, 'c')
      })
      g.globalAlpha = SEE
      g.drawImage(sheet.canvas, s.x, s.y, w, t, s.x, s.y, w, t)
      g.globalAlpha = 1
    },
  }
}
