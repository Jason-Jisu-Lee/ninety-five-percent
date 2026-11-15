import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { PREY, TIERS } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import type { Prey } from '../../world/creatures/prey'
import { icon } from '../parts/icons'
import { box, panel } from '../parts/panel'
import { text } from '../text/text'
import { wrap } from '../text/wrap'
import { tone } from './tone'
import { traits } from './traits'

const PW = 256, X = W - PW >> 1, IN = 12, COL = 72, SEE = .84, sheet = ctx(mk(PW, H))

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
      const k = PREY[p.kind], about = wrap(k.text, PW - IN * 2), list = traits(k).map(([name, say]) => [name, wrap(say, PW - IN * 2 - COL)] as const)
      const whole = Math.round, facts = [['Health', p.hp < k.hp ? `${Math.ceil(p.hp)} / ${whole(k.hp)}` : whole(k.hp)], ['Blood', whole(k.blood)], ['Power', whole(k.power)], ['Speed', whole(k.speed)]]
      tall = 82 + about.length * 11 + list.reduce((n, [, say]) => n + say.length * 11 + 4, 0) + (list.length ? 6 : 0)
      top = H - tall >> 1
      sheet.clearRect(0, 0, PW, H)
      panel(sheet, 0, 0, PW, tall, UI.border, UI.panel)
      g.globalAlpha = SEE
      g.drawImage(sheet.canvas, 0, 0, PW, tall, X, top, PW, tall)
      g.globalAlpha = 1
      box(g, X + PW - 19, top + 6, 11, 11, hot ? UI.accent : UI.border, UI.panel)
      icon(g, 'x', X + PW - 16, top + 9, UI.text)
      text(g, k.name, X + IN, top + 24, tone(p.kind), undefined, undefined, 2)
      text(g, TIERS[k.tier], X + IN, top + 38, UI.dim)
      let y = top + 55
      for (const line of about) text(g, line, X + IN, (y += 11) - 11, UI.text)
      y += 7
      facts.forEach(([name, n], i) => {
        const fx = X + IN + (i & 1) * 120, fy = y + (i >> 1) * 12
        text(g, String(name), fx, fy, UI.dim)
        text(g, String(n), fx + 92, fy, UI.text, 'r')
      })
      y += 31
      for (const [name, say] of list) {
        text(g, name, X + IN, y, UI.gold)
        for (const line of say) text(g, line, X + IN + COL, (y += 11) - 11, UI.text)
        y += 4
      }
    },
  }
}
