import type { Ctx } from '../../core/screen/canvas'
import { CM } from '../../data/dragonfly/flight'
import { PREY, type Kind } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import type { Prey } from '../../world/creatures/prey'
import { details, DW } from '../parts/details'
import { icon } from '../parts/icons'
import { box } from '../parts/panel'
import { tone } from './tone'
import { traits } from './traits'

const X = W - DW >> 1, num = (v: number) => String(+v.toFixed(2))

export function info(g: Ctx, kind: Kind, hp: number, at: (tall: number) => number[], mx = -1, my = -1) {
  const k = PREY[kind], whole = Math.round
  const [, top, tall] = details(g, {
    name: k.name, col: tone(kind), about: k.text, skills: traits(k),
    rows: [['Power', num(k.power)], ['Health', hp < k.hp ? `${Math.ceil(hp)} / ${whole(k.hp)}` : String(whole(k.hp))], ['Speed', num(k.speed / CM) + ' cm/s'], ['Lifeblood', String(whole(k.blood))]],
  }, at, mx, my)
  return [top, tall]
}

export function enemyCard() {
  let p: Prey | null = null, hot = false, top = 0, tall = 0, mx = -1, my = -1
  const onX = (x: number, y: number) => x >= X + DW - 19 && x < X + DW - 8 && y >= top + 6 && y < top + 17
  return {
    shown: () => !!p,
    open(prey: Prey) {
      p = prey
    },
    hover: (x: number, y: number) => ([mx, my] = [x, y], hot = onX(x, y)),
    click(x: number, y: number) {
      if (onX(x, y) || x < X || x >= X + DW || y < top || y >= top + tall) p = null
    },
    key(k: string) {
      if (k === 'Escape' || k === 'Enter' || k === ' ') p = null
      return true
    },
    draw(g: Ctx) {
      if (!p) return
      ;[top, tall] = info(g, p.kind, p.hp, t => [X, H - t >> 1], mx, my)
      box(g, X + DW - 19, top + 6, 11, 11, hot ? UI.accent : UI.border, UI.panel)
      icon(g, 'x', X + DW - 16, top + 9, UI.text)
    },
  }
}
