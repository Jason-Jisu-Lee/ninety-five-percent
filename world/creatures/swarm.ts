import { own } from '../../core/save/save'
import { PREY, type Kind } from '../../data/enemies/enemies'
import { H, W } from '../../data/look/screen'
import { move } from './move'
import { place } from '../place/place'
import { errand, type Prey } from './prey'

export function swarm(kinds: Kind[]) {
  const R = Math.random, list: Prey[] = [], due: { kind: Kind; at: number }[] = []
  let now = 0
  const crowd = ([x, y]: number[]) => list.filter(p => p.gx === x && p.gy === y).length
  const add = (kind: Kind, edge: boolean) => {
    const k = PREY[kind], side = R() * 4 | 0, u = R()
    const p: Prey = { kind, x: 0, y: 0, h: k.h, ang: R() * 6.283, hp: k.hp, wings: true, gold: R() < own('gold'), flash: 0, seed: R(), age: edge ? 0 : 9, gx: 0, gy: 0, wait: 0, fear: 0, tired: 0, free: 0, vx: 0, vy: 0 }
    errand(p)
    if (k.zone === 'swarm') [p.gx, p.gy] = place().swarms.reduce((a, b) => crowd(b) < crowd(a) ? b : a)
    if (edge) [p.x, p.y] = [side < 2 ? u * W : side < 3 ? -16 : W + 16, side < 1 ? -16 : side < 2 ? H + 16 : u * H]
    else [p.x, p.y, p.wait] = [p.gx, p.gy, k.sit * R()]
    list.push(p)
  }
  const drop = (p: Prey, t: number) => {
    list.splice(list.indexOf(p), 1)
    due.push({ kind: p.kind, at: t + PREY[p.kind].back * (.7 + R() * .6) })
  }
  const bring = (kind: Kind, edge: boolean) => {
    if (PREY[kind].stay) due.push({ kind, at: now + PREY[kind].back * .4 })
    else for (let i = 0; i < PREY[kind].count; i++) add(kind, edge)
  }
  for (const kind of kinds) bring(kind, false)
  return {
    list,
    join: (kind: Kind) => bring(kind, true),
    kill: drop,
    at(x: number, y: number, keep: Prey | null = null) {
      let best: Prey | null = null, near = 0
      for (const p of list) {
        const k = PREY[p.kind], d = Math.hypot(p.x - x, p.y - p.h * .7 - y)
        if (d < Math.max(k.len, k.wing * 2 + k.wide) / 2 + 4 && (!best || best !== keep && (d < near || p === keep))) [best, near] = [p, d]
      }
      return best
    },
    step(dt: number, t: number, tx: number, ty: number, held: Prey | null) {
      now = t
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
