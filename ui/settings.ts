import { toggle, tune } from '../audio/music'
import type { Ctx } from '../core/canvas'
import { veil } from '../core/dissolve'
import { save } from '../core/save'
import { UI } from '../data/palette'
import { W } from '../data/screen'
import { PREY } from '../data/stage1/enemies'
import { icon } from './icons'
import { menu } from './menu'
import { box, panel } from './panel'
import { text } from './text'

const PW = 200, X = W - PW >> 1, B = 232, MX = W - 96 >> 1, CX = X + PW - 19, SX = MX + 16
const clock = (s: number) => `${s / 3600 | 0}:${String(s / 60 % 60 | 0).padStart(2, '0')}:${String(s % 60 | 0).padStart(2, '0')}`

export function settings(toMenu: () => void, reset: () => void) {
  let shown = false, sure = false, stats = false, play = false, hot = false
  const shut = () => {
    shown = sure = stats = false
  }
  const ask = { label: 'Hard Reset', run() {
    sure = true
    confirm.focus(1)
  } }
  const tally = { label: 'Statistics', run() {
    stats = true
  } }
  const game = menu([tally, { label: 'Main Menu', run() {
    shut()
    toMenu()
  } }, ask], MX, B - 14)
  const home = menu([tally, ask], MX, B - 14)
  const confirm = menu([{ label: 'Hard Reset', run() {
    shut()
    reset()
  } }, { label: 'Cancel', run() {
    sure = false
  } }], MX, B - 14)
  const back = menu([{ label: 'Back', run() {
    stats = false
  } }], MX, B - 14)
  const now = () => sure ? confirm : stats ? back : play ? game : home, top = () => now().top - (sure ? 46 : stats ? 150 : 50)
  const onX = (x: number, y: number) => !sure && x >= CX && x < CX + 11 && y >= top() + 6 && y < top() + 17
  const slide = (x: number, y: number) => sure || stats || y < top() + 24 || y >= top() + 37 || x < MX || x >= MX + 96 ? -1 : x < SX ? 0 : (x - SX) / 8 + 1 | 0
  return {
    shown: () => shown,
    open(inGame: boolean) {
      shown = true
      play = inGame
    },
    hover(x: number, y: number) {
      hot = onX(x, y)
      return now().hover(x, y) || hot || slide(x, y) >= 0
    },
    click(x: number, y: number) {
      const v = slide(x, y)
      if (onX(x, y)) shut()
      else if (v > 0) tune(v)
      else if (!v) toggle()
      else now().click(x, y)
    },
    key(k: string) {
      const d = k === 'ArrowRight' || k === 'd' ? 1 : k === 'ArrowLeft' || k === 'a' ? -1 : 0
      if (k === 'Escape') {
        if (sure) sure = false
        else if (stats) stats = false
        else shut()
      } else if (d && !sure && !stats) tune(Math.max(0, Math.min(10, (save.music ? save.vol : 0) + d)))
      else return now().key(k)
      return true
    },
    draw(g: Ctx) {
      if (!shown) return
      const y = top(), on = save.music ? save.vol : 0
      veil(g, .5)
      panel(g, X, y, PW, B - y, UI.border, UI.panel)
      now().draw(g)
      if (sure) {
        text(g, 'Are you sure?', W / 2, y + 20, UI.text, 'c')
        text(g, 'This will delete all progress.', W / 2, y + 34, UI.text, 'c')
        return
      }
      box(g, CX, y + 6, 11, 11, hot ? UI.accent : UI.border, UI.panel)
      icon(g, 'x', CX + 3, y + 9, UI.text)
      if (stats) {
        const rows: [string, string | number][] = [
          ['Play time', clock(save.time)], ['Time in control', clock(save.hand)], ['Energy earned', save.earned], ['Upgrades bought', save.bought], ['Rests taken', save.rests],
          ['Enemies caught', Object.values(save.caught).reduce((a, b) => a + b, 0)], ...Object.entries(PREY).map(([k, p]): [string, number] => [p.many, save.caught[k] ?? 0]),
        ]
        rows.forEach(([name, n], i) => {
          text(g, name, X + (i > 5 ? 24 : 16), y + 24 + i * 11, i > 5 ? UI.dim : UI.text)
          text(g, String(n), X + PW - 16, y + 24 + i * 11, UI.accent, 'r')
        })
        return
      }
      icon(g, 'note', MX, y + 26, on ? UI.text : UI.dim)
      if (!on) icon(g, 'slash', MX, y + 26, UI.text)
      for (let i = 0; i < 10; i++) box(g, SX + i * 8, y + 26, 6, 9, i < on ? UI.accent : UI.dim, i < on ? UI.accent : UI.panel)
    },
  }
}
