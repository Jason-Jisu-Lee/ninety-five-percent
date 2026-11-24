import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { PREY, type Kind } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import type { Prey } from '../../world/creatures/prey'
import { icon } from '../parts/icons'
import { box, panel } from '../parts/panel'
import { text } from '../text/text'
import { wrap } from '../text/wrap'
import { tone } from './tone'
import { traits } from './traits'

export const PW = 256
const X = W - PW >> 1, IN = 12, COL = 72, SEE = .84, sheet = ctx(mk(PW, H))

export function info(g: Ctx, kind: Kind, hp: number, at: (tall: number) => number[]) {
  const k = PREY[kind], about = wrap(k.text, PW - IN * 2), list = traits(k).map(([name, say]) => [name, wrap(say, PW - IN * 2 - COL)] as const)
  const whole = Math.round, facts = [['Health', hp < k.hp ? `${Math.ceil(hp)} / ${whole(k.hp)}` : whole(k.hp)], ['Lifeblood', whole(k.blood)], ['Power', +k.power.toFixed(2)], ['Speed', whole(k.speed)]]
  const tall = 70 + about.length * 11 + list.reduce((n, [, say]) => n + say.length * 11 + 4, 0) + (list.length ? 6 : 0), [x, top] = at(tall)
  sheet.clearRect(0, 0, PW, H)
  panel(sheet, 0, 0, PW, tall, UI.border, UI.panel)
  g.globalAlpha = SEE
  g.drawImage(sheet.canvas, 0, 0, PW, tall, x, top, PW, tall)
  g.globalAlpha = 1
  text(g, k.name, x + IN, top + 24, tone(kind), undefined, undefined, 2)
  let y = top + 43
  for (const line of about) text(g, line, x + IN, (y += 11) - 11, UI.text)
  y += 7
  facts.forEach(([name, n], i) => {
    const fx = x + IN + (i & 1) * 120, fy = y + (i >> 1) * 12
    text(g, String(name), fx, fy, UI.dim)
    text(g, String(n), fx + 92, fy, UI.text, 'r')
  })
  y += 31
  for (const [name, say] of list) {
    text(g, name, x + IN, y, UI.gold)
    for (const line of say) text(g, line, x + IN + COL, (y += 11) - 11, UI.text)
    y += 4
  }
  return [top, tall]
}

export function enemyCard() {
  let p: Prey | null = null, hot = false, top = 0, tall = 0
  const onX = (x: number, y: number) => x >= X + PW - 19 && x < X + PW - 8 && y >= top + 6 && y < top + 17
  return {
    shown: () => !!p,
    open(prey: Prey) {
      p = prey
    },
    hover: (x: number, y: number) => hot = onX(x, y),
    click(x: number, y: number) {
      if (onX(x, y) || x < X || x >= X + PW || y < top || y >= top + tall) p = null
    },
    key(k: string) {
      if (k === 'Escape' || k === 'Enter' || k === ' ') p = null
      return true
    },
    draw(g: Ctx) {
      if (!p) return
      ;[top, tall] = info(g, p.kind, p.hp, t => [X, H - t >> 1])
      box(g, X + PW - 19, top + 6, 11, 11, hot ? UI.accent : UI.border, UI.panel)
      icon(g, 'x', X + PW - 16, top + 9, UI.text)
    },
  }
}
