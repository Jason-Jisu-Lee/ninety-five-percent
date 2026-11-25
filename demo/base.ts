import { save } from '../core/save/save'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { H, W } from '../data/look/screen'
import { blood } from '../ui/blood/blood'
import { quest } from '../ui/quest/quest'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'

export type Draw = (g: Ctx, mx: number, my: number, t: number) => void

const K = 2, sim = hunt(), low = ctx(mk(W, H)), figs: (() => void)[] = []
let clock = 0, last = performance.now()

export function figure(host: HTMLElement, n: number, name: string, note: string, draw: Draw, click?: () => void) {
  const fig = host.appendChild(document.createElement('figure')), c = fig.appendChild(mk(W * K, H * K)), out = ctx(c)
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n}</b>${name}<i>${note}</i></figcaption>`)
  let mx = -1, my = -1
  c.onmousemove = e => [mx, my] = [e.offsetX / c.clientWidth * W, e.offsetY / c.clientHeight * H]
  c.onmouseleave = () => [mx, my] = [-1, -1]
  if (click) c.onclick = click
  figs.push(() => {
    render(low, sim, clock, true, null, false)
    blood(low, save.blood)
    quest(low, 9)
    draw(low, mx, my, clock)
    out.imageSmoothingEnabled = false
    out.drawImage(low.canvas, 0, 0, W * K, H * K)
  })
}

const loop = () => {
  const now = performance.now(), dt = Math.min(.05, (now - last) / 1000)
  last = now
  sim.idle(dt, clock += dt)
  figs.forEach(f => f())
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
