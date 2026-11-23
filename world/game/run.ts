import { pack } from '../../core/save/wild'
import { hunt } from '../hunt/hunt'
import { settle } from '../place/place'

export const run = { sim: hunt(), rate: 1, paused: false }

export function restart(edge = false, keep = false) {
  if (!keep) pack.got = 0, settle()
  run.sim = hunt()
  if (edge) Object.assign(run.sim.fly, { x: 10, ang: 0 })
}

export function onward() {
  const { health, stamina } = run.sim
  settle()
  restart(true, true)
  Object.assign(run.sim, { health, stamina })
}
