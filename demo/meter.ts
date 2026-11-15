import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { W } from '../data/look/screen'
import { text } from '../ui/text/text'
import { bands } from './bands'
import { pulse } from './pulse'
import { ripple } from './ripple'
import { wave } from './wave'

const KINDS = [['Wave', wave], ['Ripple', ripple], ['Pulse', pulse]] as const
let pick = 0, last = 0

export function meterKey(k: string) {
  if (!'567'.includes(k)) return false
  pick = +k - 5
  return true
}

export function meter(g: Ctx, right: number, cy: number, bins: Uint8Array) {
  const now = performance.now() / 1000, dt = Math.min(.05, now - last)
  last = now
  text(g, `${pick + 5} ${KINDS[pick][0]}`, W - 8, 352, UI.text, 'r', UI.panel)
  KINDS[pick][1](g, right, cy, bands(bins, dt), dt)
}
