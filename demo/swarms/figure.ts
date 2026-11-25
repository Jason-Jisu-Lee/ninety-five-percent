import { ctx, mk } from '../../core/screen/canvas'
import { H, W } from '../../data/look/screen'
import { render } from '../../world/game/render'
import { hunt } from '../../world/hunt/hunt'
import { place } from '../../world/place/place'
import { LAYOUTS } from './layouts'

const K = 2, LONG = 60

export const pick = (s: ReturnType<typeof hunt>) => {
  const { fly } = s, list = s.prey.list.filter(p => p.free <= 0 && p !== s.held)
  const far = (p: { x: number; y: number }) => Math.hypot(p.x - fly.x, p.y - fly.y)
  const ahead = list.filter(p => far(p) > 25 && Math.cos(Math.atan2(p.y - fly.y, p.x - fly.x) - fly.ang) > .5)
  return (ahead.length ? ahead : list).reduce((a, p) => far(p) < far(a) ? p : a, list[0])
}

export function figure(host: HTMLElement, n: number) {
  const fig = host.appendChild(document.createElement('figure')), c = fig.appendChild(mk(W * K, H * K)), out = ctx(c), low = ctx(mk(W, H)), way = LAYOUTS[n]
  const use = () => place().swarms.splice(0, Infinity, ...way.at.map(a => [...a]))
  let sim = hunt(), clock = 0, t = 0, trail: number[][] = []
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n ? n : ''}</b>${way.name}<i>${way.note}</i><i>${way.gap} s between catches on average</i><i>first catch by ${way.first} s at the latest</i></figcaption>`)

  function reset() {
    use()
    sim = hunt()
    for (clock = 0; clock < 6; clock += 1 / 60) sim.prey.step(1 / 60, clock, -999, -999, null)
    Object.assign(sim.fly, { x: 10, ang: 0 })
    ;[t, trail] = [0, []]
  }

  c.onclick = reset
  reset()
  return {
    fig,
    reset,
    frame(dt: number) {
      use()
      if ((t += dt) > LONG) reset()
      sim.stamina = 100
      if (!sim.mark) sim.mark = pick(sim) ?? null
      sim.step(dt, clock += dt)
      trail.push([sim.fly.x, sim.fly.y])
      if (trail.length > 420) trail.shift()
      render(low, sim, clock, true, null, false)
      trail.forEach(([x, y], i) => {
        low.fillStyle = `rgba(233,226,212,${(i / trail.length * .5).toFixed(2)})`
        low.fillRect(Math.round(x), Math.round(y), 1, 1)
      })
      out.imageSmoothingEnabled = false
      out.drawImage(low.canvas, 0, 0, W * K, H * K)
    },
  }
}
