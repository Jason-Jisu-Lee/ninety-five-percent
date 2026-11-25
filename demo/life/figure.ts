import { save } from '../../core/save/save'
import { ctx, mk } from '../../core/screen/canvas'
import { H, W } from '../../data/look/screen'
import { hud } from '../../ui/hud/hud'
import { width } from '../../ui/text/text'
import { render } from '../../world/game/render'
import { hunt } from '../../world/hunt/hunt'
import { HOLD, WAYS } from './ways'

const none = () => {}, K = 2, AFTER = 2.5

const pick = (s: ReturnType<typeof hunt>) => {
  const { fly } = s, list = s.prey.list.filter(p => p.free <= 0 && p !== s.held), far = (p: { x: number; y: number }) => Math.hypot(p.x - fly.x, p.y - fly.y)
  const ahead = list.filter(p => far(p) > 25 && Math.cos(Math.atan2(p.y - fly.y, p.x - fly.x) - fly.ang) > .5)
  return (ahead.length ? ahead : list).reduce((a, p) => far(p) < far(a) ? p : a, list[0]) ?? null
}

export function figure(host: HTMLElement, n: number) {
  const fig = host.appendChild(document.createElement('figure')), c = fig.appendChild(mk(W * K, H * K)), out = ctx(c), low = ctx(mk(W, H)), said = fig.appendChild(document.createElement('p')), way = WAYS[n], ui = hud(none, none, none, none, [])
  let sim = hunt(), clock = 0, t = 0, first = -1, pay = 0, from = [0, 0], mine = { blood: 0, count: 0 }
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${way.name}<i>${way.note}</i></figcaption>`)

  function reset() {
    sim = hunt()
    for (clock = 0; clock < 6; clock += 1 / 60) sim.prey.step(1 / 60, clock, -999, -999, null)
    Object.assign(sim.fly, { x: 10, ang: 0 })
    const kill = sim.prey.kill
    sim.prey.kill = (h, at) => {
      if (first < 0) [first, from, pay] = [t, [h.x, h.y - h.h * .7], save.blood - mine.blood]
      kill(h, at)
    }
    ;[t, first, mine] = [0, -1, { blood: 0, count: 0 }]
  }

  c.onclick = reset
  reset()
  return {
    fig,
    reset,
    frame(dt: number) {
      Object.assign(save, { blood: mine.blood, quest: 0, count: Math.min(mine.count, 1) })
      t += dt
      sim.stamina = 100
      if (!sim.mark) sim.mark = pick(sim)
      sim.step(dt, clock += dt)
      mine = { blood: save.blood, count: save.count }
      const u = first < 0 ? -1 : t - first, line = u < 0 ? 'before the first catch' : u < HOLD ? `${u.toFixed(1)} s after the first catch` : 'the indicator is gone'
      if (said.textContent !== line) said.textContent = line
      render(low, sim, clock, true, null, false)
      if (way.late && u >= 0 && u < way.late) save.blood -= pay
      ui.draw(low, false)
      if (u >= 0 && u < HOLD) way.draw(low, u, [13, 10, 24 + width(String(Math.floor(save.blood))) - 13, 11], from)
      if (u > HOLD + AFTER) reset()
      out.imageSmoothingEnabled = false
      out.drawImage(low.canvas, 0, 0, W * K, H * K)
    },
  }
}
