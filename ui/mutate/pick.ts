import { sound } from '../../audio/player/sound'
import { deal, take } from '../../core/save/mutate'
import type { Ctx } from '../../core/screen/canvas'
import type { Mutation } from '../../data/game/mutations'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { panel } from '../parts/panel'
import { side } from '../parts/side'
import { text } from '../text/text'
import { wrap } from '../text/wrap'

const CW = 112, CH = 56, GAP = 8, Y = H - CH >> 1, GUARD = 300

export function mutationPick() {
  let cards: Mutation[] = [], sel = -1, since = 0
  const left = (i: number) => (W - cards.length * (CW + GAP) + GAP >> 1) + i * (CW + GAP)
  const at = (x: number, y: number) => y >= Y && y < Y + CH ? cards.findIndex((_, i) => x >= left(i) && x < left(i) + CW) : -1
  const light = (i: number) => {
    if (i >= 0 && i !== sel) sound('hover')
    return (sel = i) >= 0
  }
  const pick = (i: number) => {
    if (!cards[i] || performance.now() - since < GUARD) return
    take(cards[i])
    cards = []
  }
  return {
    shown: () => cards.length > 0,
    open() {
      ;[cards, sel, since] = [deal(), -1, performance.now()]
    },
    hover: (x: number, y: number) => light(at(x, y)),
    click: (x: number, y: number) => pick(at(x, y)),
    key(k: string) {
      const d = side(k)
      if (d) light(sel < 0 ? d > 0 ? 0 : cards.length - 1 : (sel + d + cards.length) % cards.length)
      else if (k === 'Enter' || k === ' ') pick(sel)
      return true
    },
    draw(g: Ctx) {
      cards.forEach((m, i) => {
        panel(g, left(i), Y, CW, CH, i === sel ? UI.accent : UI.border, UI.panel)
        text(g, m.name, left(i) + CW / 2, Y + 19, i === sel ? UI.accent : UI.gold, 'c')
        wrap(m.text, CW - 16).forEach((line, j) => text(g, line, left(i) + CW / 2, Y + 35 + j * 11, UI.text, 'c'))
      })
    },
  }
}
