import { PREY } from '../../data/stage1/enemies'
import { H, W } from '../../data/look/screen'
import { move } from './move'
import { errand, type Kind, type Prey } from './prey'

export function swarm() {
  const R = Math.random, list: Prey[] = [], due: { kind: Kind; at: number }[] = []
  const add = (kind: Kind, edge: boolean) => {
    const k = PREY[kind], side = R() * 4 | 0, u = R()
    const p: Prey = { kind, x: 0, y: 0, h: k.h, ang: R() * 6.283, hp: k.hp, wings: true, flash: 0, seed: R(), age: edge ? 0 : 9, gx: 0, gy: 0, wait: 0, fear: 0, tired: 0, free: 0, vx: 0, vy: 0 }
    errand(p)
    if (edge) [p.x, p.y] = [side < 2 ? u * W : side < 3 ? -16 : W + 16, side < 1 ? -16 : side < 2 ? H + 16 : u * H]
    else [p.x, p.y, p.wait] = [p.gx, p.gy, k.sit * R()]
    list.push(p)
  }
  const drop = (p: Prey, t: number) => {
    list.splice(list.indexOf(p), 1)
    due.push({ kind: p.kind, at: t + PREY[p.kind].back * (.7 + R() * .6) })
  }
  for (const kind of Object.keys(PREY) as Kind[]) {
    if (PREY[kind].stay) due.push({ kind, at: PREY[kind].back * .4 })
    else for (let i = 0; i < PREY[kind].count; i++) add(kind, false)
  }
  return {
    list,
    kill: drop,
    step(dt: number, t: number, tx: number, ty: number, held: Prey | null) {
      for (let i = due.length; i--;) if (t >= due[i].at) add(due.splice(i, 1)[0].kind, true)
      for (let i = list.length; i--;) {
        const p = list[i], { x, y } = p
        p.age += dt
        p.flash -= dt
        if (p === held || !dt) continue
        if (move(p, dt, t, tx, ty)) drop(p, t)
        else [p.vx, p.vy] = [(p.x - x) / dt, (p.y - y) / dt]
      }
    },
  }
}
