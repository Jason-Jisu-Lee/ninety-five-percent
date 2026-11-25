import './swarms/fresh'
import { figure } from './swarms/figure'
import { LAYOUTS } from './swarms/layouts'

const host = document.querySelector('section')!, figs = LAYOUTS.map((_, n) => figure(host, n))

let last = -1
function tick(at: number) {
  requestAnimationFrame(tick)
  const dt = last < 0 ? 0 : Math.min(.05, (at - last) / 1000)
  last = at
  for (const f of figs) f.frame(dt)
}
requestAnimationFrame(tick)
