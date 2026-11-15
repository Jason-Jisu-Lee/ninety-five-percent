import type { Ctx } from '../core/canvas'
import { veil } from '../core/dissolve'
import { UI } from '../data/palette'
import { W } from '../data/screen'
import { icon } from './icons'
import { menu } from './menu'
import { box, panel } from './panel'
import { text } from './text'

const PW = 200, X = W - PW >> 1, B = 232, MX = W - 96 >> 1, CX = X + PW - 19

export function settings(toMenu: () => void, reset: () => void) {
  let shown = false, sure = false, play = false, hot = false
  const shut = () => {
    shown = sure = false
  }
  const ask = { label: 'Hard Reset', run() {
    sure = true
    confirm.focus(1)
  } }
  const game = menu([{ label: 'Main Menu', run() {
    shut()
    toMenu()
  } }, ask], MX, B - 14)
  const home = menu([ask], MX, B - 14)
  const confirm = menu([{ label: 'Hard Reset', run() {
    shut()
    reset()
  } }, { label: 'Cancel', run() {
    sure = false
  } }], MX, B - 14)
  const now = () => sure ? confirm : play ? game : home, top = () => now().top - (sure ? 46 : 24)
  const onX = (x: number, y: number) => !sure && x >= CX && x < CX + 11 && y >= top() + 6 && y < top() + 17
  return {
    shown: () => shown,
    open(inGame: boolean) {
      shown = true
      play = inGame
    },
    hover(x: number, y: number) {
      hot = onX(x, y)
      return now().hover(x, y) || hot
    },
    click(x: number, y: number) {
      if (onX(x, y)) shut()
      else now().click(x, y)
    },
    key(k: string) {
      if (k !== 'Escape') return now().key(k)
      if (sure) sure = false
      else shut()
      return true
    },
    draw(g: Ctx) {
      if (!shown) return
      veil(g, .5)
      panel(g, X, top(), PW, B - top(), UI.border, UI.panel)
      now().draw(g)
      if (sure) {
        text(g, 'Are you sure?', W / 2, top() + 20, UI.text, 'c')
        text(g, 'This will delete all progress.', W / 2, top() + 34, UI.text, 'c')
      } else {
        box(g, CX, top() + 6, 11, 11, hot ? UI.accent : UI.border, UI.panel)
        icon(g, 'x', CX + 3, top() + 9, UI.text)
      }
    },
  }
}
