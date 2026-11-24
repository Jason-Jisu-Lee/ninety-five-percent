import { shade, veil } from '../../core/draw/dissolve'
import { ctx, mk } from '../../core/screen/canvas'
import { H, W } from '../../data/look/screen'
import { hud } from '../../ui/hud/hud'
import { glow } from '../../ui/track/track'
import { render } from '../../world/game/render'
import { hunt } from '../../world/hunt/hunt'
import { place } from '../../world/place/place'
import { WAYS } from './ways'

const none = () => {}, ui = hud(none, none, none, none, []), K = 2

export function figure(host: HTMLElement, n: number) {
  const fig = host.appendChild(document.createElement('figure')), c = fig.appendChild(mk(W * K, H * K)), out = ctx(c), low = ctx(mk(W, H)), said = fig.appendChild(document.createElement('p'))
  let sim = hunt(), clock = 0, t = 0, out0 = -1, land = -1, shut = -1
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${WAYS[n].name}<i>${WAYS[n].note}</i></figcaption>`)

  function reset() {
    sim = hunt()
    for (clock = 0; clock < 6; clock += 1 / 60) sim.prey.step(1 / 60, clock, -999, -999, null)
    sim.stamina = 9
    ;[t, out0, land, shut] = [0, -1, -1, -1]
  }

  function step(dt: number) {
    if (shut >= 0) return void ((shut += dt) > .55 && reset())
    t += dt
    sim.step(dt, clock += dt)
    if (sim.spent) [sim.spent, out0] = [false, t]
    if (land < 0 && out0 >= 0 && sim.fly.perched) land = t
    if (land >= 0 ? t > land + 1.8 : t > 20) shut = 0
  }

  function draw() {
    const line = out0 < 0 ? 'flying, stamina almost gone' : land < 0 ? `${(t - out0).toFixed(1)} s   out of stamina, flying to the closest rest spot` : 'landed, resting'
    if (said.textContent !== line) said.textContent = line
    render(low, sim, clock, true, null, false)
    ui.draw(low, false)
    if (out0 >= 0 && land < 0) WAYS[n].draw(low, { u: t - out0, spots: place().perches, near: sim.rest, x: Math.round(sim.fly.x), y: Math.round(sim.fly.y - sim.fly.h * .7) })
    if (shut >= 0) veil(low, Math.min(1, shut / .4))
    const dark = shade.n
    shade.n = 0
    out.imageSmoothingEnabled = false
    out.drawImage(low.canvas, 0, 0, W * K, H * K)
    glow(out, K, 1, dark)
  }

  c.onclick = reset
  reset()
  return {
    fig,
    reset,
    frame(dt: number) {
      step(dt)
      draw()
    },
  }
}
