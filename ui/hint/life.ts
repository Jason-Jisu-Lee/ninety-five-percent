import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { LIFE as L } from '../../data/game/hints'
import { UI } from '../../data/look/palette'
import { orb } from '../parts/icons'
import { text } from '../text/text'

const S = { t: -1, x: 0, y: 0, pay: 0 }

export const teach = (x: number, y: number, pay: number) => Object.assign(S, { t: 0, x, y, pay })
export const owing = () => S.t >= 0 && S.t < L.fly ? S.pay : 0
export const flash = () => S.t >= L.fly && S.t < L.fly + L.flash

export function age(dt: number) {
  if (S.t >= 0 && (S.t += dt) > L.hold) S.t = -1
}

export function life(g: Ctx, edge: number) {
  const u = S.t, k = Math.min(1, u / L.fly), e = k * k * (3 - 2 * k)
  if (u < 0) return
  if (k < 1) return orb(g, Math.round(S.x + (16 - S.x) * e), Math.round(S.y + (14 - S.y) * e - Math.sin(e * Math.PI) * L.arc), '', UI.panel)
  g.globalAlpha = clamp((L.hold - u) / .4)
  L.lines.forEach((line, i) => text(g, line, edge + 24, 19 + i * 12, i ? UI.text : UI.gold, undefined, UI.panel))
  g.globalAlpha = 1
}
