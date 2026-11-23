import { veil } from '../../core/draw/dissolve'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { W } from '../../data/look/screen'
import { icon } from '../parts/icons'
import { mix } from '../../audio/player/music'
import { save } from '../../core/save/save'
import { menu } from '../parts/menu'
import { mixer } from '../parts/mixer'
import { box, panel } from '../parts/panel'
import { text } from '../text/text'
import { wrap } from '../text/wrap'
import { ROWS, statistics } from './statistics'

const PW = 200, X = W - PW >> 1, B = 232, MX = W - 96 >> 1, CX = X + PW - 19
const WIPE = ['Are you sure?', 'This will delete all progress.'], QUIT = wrap('This will forfeit your current run and you will lose 95% of current blood points. Continue?', PW - 24)

export function settings(toMenu: () => void, reset: () => void) {
  let shown = false, stats = false, play = false, hot = false, mx = 0, my = 0, sure: [ReturnType<typeof menu>, string[]] | undefined
  const shut = () => {
    shown = stats = false
    sure = undefined
  }
  const check = (m: ReturnType<typeof menu>, lines: string[]) => {
    sure = [m, lines]
    m.focus(-1)
  }
  const item = (label: string, run: () => void) => ({ label, run })
  const ask = item('Hard Reset', () => check(wipe, WIPE))
  const tally = item('Statistics', () => {
    stats = true
  })
  const game = menu([tally, item('Main Menu', () => check(quit, QUIT))], MX, B - 14)
  const home = menu([tally, ask], MX, B - 14)
  const no = item('Cancel', () => {
    sure = undefined
  })
  const wipe = menu([item('Hard Reset', () => {
    shut()
    reset()
  }), no], MX, B - 14)
  const quit = menu([item('Continue', () => {
    shut()
    toMenu()
  }), no], MX, B - 14)
  const back = menu([item('Back', () => {
    stats = false
  })], MX, B - 14)
  const now = () => sure ? sure[0] : stats ? back : play ? game : home, top = () => now().top - (sure ? 18 + sure[1].length * 14 : stats ? ROWS * 11 + 29 : 76)
  const onX = (x: number, y: number) => !sure && x >= CX && x < CX + 11 && y >= top() + 6 && y < top() + 17
  const levels = (x: number, y: number, press = false) => !sure && !stats && mixer[press ? 'click' : 'on'](x, y, W - mixer.w >> 1, top() + 26)
  const point = (x: number, y: number) => {
    ;[mx, my, hot] = [x, y, onX(x, y)]
    return now().hover(x, y) || hot || levels(x, y)
  }
  return {
    shown: () => shown,
    open(inGame: boolean) {
      shown = true
      play = inGame
      now().focus(-1)
    },
    hover: point,
    click(x: number, y: number) {
      if (onX(x, y)) shut()
      else if (!levels(x, y, true)) now().click(x, y)
      point(x, y)
    },
    key(k: string) {
      const d = k === 'ArrowRight' || k === 'd' ? 1 : k === 'ArrowLeft' || k === 'a' ? -1 : 0
      if (k === 'Escape') {
        if (sure) sure = undefined
        else if (stats) stats = false
        else shut()
      } else if (d && !sure && !stats) mix('vol', save.vol + d)
      else return now().key(k)
      point(mx, my)
      return true
    },
    draw(g: Ctx) {
      if (!shown) return
      const y = top()
      veil(g, .5)
      panel(g, X, y, PW, B - y, UI.border, UI.panel)
      now().draw(g)
      if (sure) {
        sure[1].forEach((line, i) => text(g, line, W / 2, y + 20 + i * 14, UI.text, 'c'))
        return
      }
      box(g, CX, y + 6, 11, 11, hot ? UI.accent : UI.border, UI.panel)
      icon(g, 'x', CX + 3, y + 9, UI.text)
      if (stats) statistics(g, X + 16, X + PW - 16, y + 24)
      else mixer.draw(g, W - mixer.w >> 1, y + 26)
    },
  }
}
