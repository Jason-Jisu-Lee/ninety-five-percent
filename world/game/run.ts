import { shed } from '../../core/save/mutate'
import { claim } from '../../core/save/save'
import { pack } from '../../core/save/wild'
import { hunt } from '../hunt/hunt'
import { rotate, settle } from '../place/place'
import { G } from './state'

export const run = { sim: hunt(), rate: 1, paused: false }

export function restart(edge = false, keep = false) {
  if (!keep) pack.got = 0, settle(), shed()
  rotate()
  run.sim = hunt()
  claim()
  Object.assign(G, { cast: -1, hale: run.sim.health })
  if (edge) Object.assign(run.sim.fly, { x: 10, ang: 0 })
}

export function onward() {
  const { health, stamina } = run.sim
  settle()
  restart(true, true)
  Object.assign(run.sim, { health, stamina })
}
