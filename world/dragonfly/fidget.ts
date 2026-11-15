import { between } from '../../core/math/between'
import { DF } from '../../data/dragonfly/body'
import { REST } from '../../data/dragonfly/flight'

export function fidget(f: { ang: number; frame: number; lean: number }) {
  const R = Math.random, n = DF.flapFrames
  let still = REST.every[0], busy = 0, act = 0
  return (dt: number) => {
    busy -= dt
    if ((still -= dt) <= 0) {
      still = between(REST.every)
      act = R() * 3 | 0
      busy = act > 1 ? 0 : act ? between(REST.droop) : REST.flick
      if (act > 1) f.ang += (R() < .5 ? -1 : 1) * 2 * Math.PI / DF.headings
    }
    f.lean = 0
    f.frame = busy <= 0 ? n : act ? n + 2 : [n + 1, n, n + 2, n][Math.min(3, busy / REST.flick * 4 | 0)]
  }
}
