const R0 = 30, HOLD = 2
const up = (t: number, time: number, power: number) => Math.min(1, Math.max(0, t - HOLD) / time) ** power
const back = (u: number) => 1 + 2.7 * (u - 1) ** 3 + 1.7 * (u - 1) ** 2

export const CIRCLES: { name: string; note: string; at(t: number, far: number): { r: number; band: number; show: number } }[] = [
  {
    name: 'Hard edge',
    note: 'Appears at once. A crisp pixel circle. Opens slowly, then faster, over 1.8 s',
    at: (t, far) => ({ r: R0 + (far - R0) * up(t, 1.8, 3), band: 0, show: 1 }),
  },
  {
    name: 'Soft edge',
    note: 'Fades in. A dotted edge, like the other fades in the game. Opens slowly, then faster, over 1.8 s',
    at(t, far) {
      const r = 38 + (far / .66 - 38) * up(t, 1.8, 3)
      return { r, band: r / 3, show: Math.min(1, t / .4) }
    },
  },
  {
    name: 'Pull back, then burst',
    note: 'Pops open. Tightens for a moment just before 2 s, then bursts open over 1.3 s',
    at(t, far) {
      const pull = Math.min(1, Math.max(0, (t - HOLD + .3) / .3)), tight = R0 * (1 - .22 * pull * pull * (3 - 2 * pull))
      return { r: t < .3 ? R0 * back(t / .3) : tight + (far - tight) * up(t, 1.3, 4), band: 0, show: 1 }
    },
  },
]
