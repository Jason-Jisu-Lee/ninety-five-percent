import { shed } from '../../core/save/mutate'
import { claim, progress } from '../../core/save/save'
import { pack } from '../../core/save/wild'
import { hunt } from '../hunt/hunt'
import { rotate, settle, where } from '../place/place'
import { G } from './state'

export const run = { sim: hunt(), rate: 1, paused: false }

export function restart(edge = false, keep = false) {
  if (!keep) pack.got = 0, settle(), shed()
  rotate()
  run.sim = hunt()
  claim()
  Object.assign(G, { cast: -1, hale: run.sim.health, bird: -99 })
  if (edge) Object.assign(run.sim.fly, { x: 10, ang: 0 })
}

export function onward() {
  const { health, stamina } = run.sim
  settle()
  if (where.stage > 1) progress('marsh')
  restart(true, true)
  Object.assign(run.sim, { health, stamina })
}
