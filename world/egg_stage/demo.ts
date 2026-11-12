import { EGG, OXYGEN, RESPIRE, START } from '../../data/egg'
import { ECY } from './terrain'

type Bubble = { x: number; y: number; a: number }
export type Phase = 'ready' | 'active' | 'cooldown'

export const rise = (b: Bubble) => b.y - b.a * 2.4

export function demo() {
  const { active, cooldown, idle } = RESPIRE
  let rolled = -1
  const s = { count: START.bubbles, prog: START.progress, o2: OXYGEN.base, phase: 'active' as Phase, fill: 1, bubbles: [] as Bubble[] }
  return Object.assign(s, {
    step(t: number) {
      const ph = t % (active + cooldown + idle), sec = Math.floor(t)
      s.o2 = OXYGEN.base + OXYGEN.swing * Math.sin(t * Math.PI * 2 / OXYGEN.period)
      s.phase = ph < active ? 'active' : ph < active + cooldown ? 'cooldown' : 'ready'
      s.fill = ph < active ? 1 - ph / active : (ph - active) / cooldown
      s.bubbles = s.bubbles.filter(b => rise(b) >= 15)
      if (s.phase === 'active' && sec !== rolled) {
        rolled = sec
        const roll = Math.abs(Math.sin(sec * 12.9898) * 43758.5453 % 1)
        if (roll < s.o2) s.bubbles.push({ x: EGG.x - 8 + roll * 14, y: ECY - EGG.ry + 2, a: 0 })
      }
      if ((s.prog += START.creep) > 1) s.prog = START.progress
      for (const b of s.bubbles) if (b.a++, rise(b) < 15) s.count++
    },
  })
}

export type Demo = ReturnType<typeof demo>
