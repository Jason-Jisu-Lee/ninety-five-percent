import { hunt } from './hunt/hunt'

export const run = { sim: hunt(), rate: 1, paused: false }

export function restart(edge = false) {
  run.sim = hunt()
  if (edge) Object.assign(run.sim.fly, { x: 10, ang: 0 })
}
