import './life/fresh'
import { figure } from './life/figure'
import { WAYS } from './life/ways'

const host = document.querySelector('section')!, figs = WAYS.map((_, n) => figure(host, n))

let last = -1
function tick(at: number) {
  requestAnimationFrame(tick)
  const dt = last < 0 ? 0 : Math.min(.05, (at - last) / 1000)
  last = at
  for (const f of figs) f.frame(dt)
}
requestAnimationFrame(tick)
