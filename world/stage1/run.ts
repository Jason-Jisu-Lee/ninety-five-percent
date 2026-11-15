import { hunt } from './hunt/hunt'

export const run = { sim: hunt(), rate: 1, paused: false }

export function restart() {
  run.sim = hunt()
}
