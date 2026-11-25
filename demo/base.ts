import { save } from '../core/save/save'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { H, W } from '../data/look/screen'
import { blood } from '../ui/blood/blood'
import { feastButton } from '../ui/feast/button'
import { nav } from '../ui/nav/nav'
import { quest } from '../ui/quest/quest'
import { glow } from '../ui/track/track'
import { nextWild } from '../ui/wild/next'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'

export type Draw = (g: Ctx, mx: number, my: number, t: number) => void
type Parts = { shop?: boolean; counter?: boolean; lair?: boolean; click?: () => void; view?: number[] }

const K = 2, none = () => {}, sim = hunt(), low = ctx(mk(W, H)), bar = nav([none, none, none]), wild = nextWild(none), meal = feastButton(none), figs: (() => void)[] = []
let clock = 0, last = performance.now()

export function figure(host: HTMLElement, n: number | string, name: string, note: string, draw: Draw, { shop = true, counter = true, lair = true, click, view: [vx, vy, vw, vh] = [0, 0, W, H] }: Parts = {}) {
  const fig = host.appendChild(document.createElement('figure')), c = fig.appendChild(mk(vw * K, vh * K)), out = ctx(c)
  Object.assign(c.dataset, { vx, vy })
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n}</b>${name}<i>${note}</i></figcaption>`)
  let mx = -1, my = -1
  c.onmousemove = e => [mx, my] = [vx + e.offsetX / c.clientWidth * vw, vy + e.offsetY / c.clientHeight * vh]
  c.onmouseleave = () => [mx, my] = [-1, -1]
  if (click) c.onclick = click
  figs.push(() => {
    render(low, sim, clock, true, null, false)
    if (counter) blood(low, save.blood)
    quest(low, 9)
    bar.draw(low, false, false)
    if (shop) wild.hover(mx, my), wild.draw(low)
    if (lair) meal.hover(mx, my), meal.draw(low)
    draw(low, mx, my, clock)
    out.imageSmoothingEnabled = false
    out.drawImage(low.canvas, vx, vy, vw, vh, 0, 0, vw * K, vh * K)
    out.setTransform(1, 0, 0, 1, -vx * K, -vy * K)
    glow(out, K, 1, 0)
    out.setTransform(1, 0, 0, 1, 0, 0)
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
