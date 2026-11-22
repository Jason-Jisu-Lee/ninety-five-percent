import { hunt } from '../hunt/hunt'
import { renew } from '../place/place'

export const run = { sim: hunt(), rate: 1, paused: false }

let first = true

export function restart(edge = false) {
  if (!first && !edge) renew()
  first = false
  run.sim = hunt()
  if (edge) Object.assign(run.sim.fly, { x: 10, ang: 0 })
}
