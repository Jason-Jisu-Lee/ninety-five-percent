import { shade, veil } from '../../core/draw/dissolve'
import { ctx, mk } from '../../core/screen/canvas'
import { H, W } from '../../data/look/screen'
import { hud } from '../../ui/hud/hud'
import { dialog } from '../../ui/parts/dialog'
import { glow } from '../../ui/track/track'
import { render } from '../../world/game/render'
import { hunt } from '../../world/hunt/hunt'
import { SAY, WAYS } from './ways'

const none = () => {}, ui = hud(none, none, none, none, []), K = 2, START = 1.2, HOLD = 6

export function figure(host: HTMLElement, n: number) {
  const fig = host.appendChild(document.createElement('figure')), c = fig.appendChild(mk(W * K, H * K)), out = ctx(c), low = ctx(mk(W, H)), said = fig.appendChild(document.createElement('p')), box = dialog(), way = WAYS[n]
  let sim = hunt(), clock = 0, t = 0, shut = -1
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${way.name}<i>${way.note}</i></figcaption>`)

  function reset() {
    sim = hunt()
    for (clock = 0; clock < 6; clock += 1 / 60) sim.prey.step(1 / 60, clock, -999, -999, null)
    Object.assign(sim.fly, { x: 10, ang: 0 })
    ;[t, shut] = [0, -1]
  }

  c.onclick = reset
  reset()
  return {
    fig,
    reset,
    frame(dt: number) {
      const u = t - START, on = u >= 0 && u < HOLD, line = u < 0 ? 'the first run after the Lair starts' : on ? way.stop ? 'the game is stopped until Got it is pressed' : `${u.toFixed(1)} s   the hint is showing, the game keeps running` : way.stop ? 'the player pressed Got it' : 'the hint is gone'
      if (shut >= 0) { if ((shut += dt) > .55) reset() } else if ((t += dt) > START + HOLD + 2) shut = 0
      if (on && way.stop && !box.shown()) box.open([SAY], [['Got it', none]])
      if (!on && box.shown()) box.key('Escape')
      if (!(on && way.stop)) sim.step(dt, clock += dt)
      if (said.textContent !== line) said.textContent = line
      render(low, sim, clock, true, null, false)
      ui.draw(low, false)
      if (on) way.draw(low, u)
      box.draw(low)
      if (shut >= 0) veil(low, Math.min(1, shut / .4))
      const dark = shade.n
      shade.n = 0
      out.imageSmoothingEnabled = false
      out.drawImage(low.canvas, 0, 0, W * K, H * K)
      glow(out, K, 1, dark)
    },
  }
}
