import { rng } from '../../core/rng'
import { PREY, RESPAWN } from '../../data/prey'
import { H, W } from '../../data/screen'
import { move, type Kind, type Prey } from './prey'

export function swarm() {
  const R = rng(9), list: Prey[] = [], due: { kind: Kind; at: number }[] = []
  const add = (kind: Kind, edge: boolean) => {
    const a = R() * 6.283, x = edge ? W / 2 + Math.cos(a) * (W / 2 + 20) : 30 + R() * (W - 60), y = edge ? H / 2 + Math.sin(a) * (H / 2 + 20) : 40 + R() * (H - 70)
    list.push({ kind, x, y, h: PREY[kind].h, ang: a + Math.PI, hp: PREY[kind].hp, wings: true, flash: 0, seed: R(), age: edge ? 0 : 9 })
  }
  for (const kind of Object.keys(PREY) as Kind[]) for (let i = 0; i < PREY[kind].count; i++) add(kind, false)
  return {
    list,
    kill(p: Prey, t: number) {
      list.splice(list.indexOf(p), 1)
      due.push({ kind: p.kind, at: t + RESPAWN[0] + R() * (RESPAWN[1] - RESPAWN[0]) })
    },
    step(dt: number, t: number, tx: number, ty: number, held: Prey | null) {
      for (let i = due.length; i--;) if (t >= due[i].at) add(due.splice(i, 1)[0].kind, true)
      for (const p of list) {
        p.age += dt
        p.flash -= dt
        if (p !== held) move(p, dt, t, tx, ty)
      }
    },
  }
}
