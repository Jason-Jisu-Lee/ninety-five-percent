import { rgb } from '../../../core/screen/canvas'
import { COLORS, WING, type Color } from '../../../data/dragonfly/colors'

const tint = (hex: string, k: number) => '#' + rgb(hex).map(v => Math.round(k > 1 ? v + (255 - v) * (k - 1) : v * k).toString(16).padStart(2, '0')).join('')

export function look(color: Color, st: number[]) {
  const [base, band, fill = WING.fill, vein = WING.vein] = COLORS[color]
  return {
    st, fill, vein, abd: base, abdDk: band || tint(base, .42), tip: tint(base, .28), thorax: tint(base, .76), thoraxHi: tint(base, 1.3),
    thoraxDk: tint(base, .44), head: tint(base, .68), eye: tint(base, .36),
  }
}

export type Look = ReturnType<typeof look>
