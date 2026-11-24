import './unlock/fresh'
import { figure } from './unlock/figure'
import { WAYS } from './unlock/ways'

const host = document.querySelector('section')!, seen = new Set<Element>(), figs = WAYS.map((_, n) => figure(host, n))
const watch = new IntersectionObserver(all => all.forEach(e => {
  if (e.isIntersecting && !seen.has(e.target)) figs.find(f => f.fig === e.target)!.reset()
  seen[e.isIntersecting ? 'add' : 'delete'](e.target)
}), { threshold: .3 })
figs.forEach(f => watch.observe(f.fig))

let last = -1
function tick(at: number) {
  requestAnimationFrame(tick)
  const dt = last < 0 ? 0 : Math.min(.05, (at - last) / 1000)
  last = at
  for (const f of figs) if (seen.has(f.fig)) f.frame(dt)
}
requestAnimationFrame(tick)
