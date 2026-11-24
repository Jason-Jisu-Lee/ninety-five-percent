import { clamp } from '../../core/math/clamp'

const R0 = 38, PULL = .3, BURST = 1.3

export const HOLD = 1.2, OPEN = HOLD + BURST

export function circle(t: number, far: number) {
  const pull = clamp((t - HOLD + PULL) / PULL), tight = R0 * (1 - .22 * pull * pull * (3 - 2 * pull)), r = tight + (far / .66 - tight) * clamp((t - HOLD) / BURST) ** 4
  return { r, band: r / 3, show: Math.min(1, t / .4) }
}
