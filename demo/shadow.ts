import { pack } from '../core/save/wild'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { H, W } from '../data/look/screen'
import { PREY } from '../data/enemies/enemies'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'
import { perch } from '../world/hunt/perch'

type Pass = { span: number; alpha: number; at: (u: number) => [number, number, number]; time: number }
type Look = { name: string; say: string; pass: Pass; scatter?: boolean; hide?: boolean }

const LOOP = 10, START = 2.5, INK = '#0b1a14'
const WING = [[.4, 0], [.33, .045], [.22, .07], [.2, .3], [.14, .62], [.08, .86], [.07, .98], [.03, .93], [.02, 1], [-.02, .94], [-.04, .99], [-.08, .92], [-.1, .95], [-.13, .86], [-.18, .62], [-.16, .3], [-.12, .1], [-.2, .09], [-.4, .17], [-.43, .06], [-.44, 0]]
const OUTLINE = [...WING, ...WING.slice(1, -1).reverse().map(([x, y]) => [x, -y])]
const half = ctx(mk(W / 2, H / 2))

const line = (x0: number, y0: number, x1: number, y1: number) => (u: number): [number, number, number] => [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, Math.atan2(y1 - y0, x1 - x0)]
const glide: Pass = { span: 300, alpha: .32, time: 3.6, at: line(-200, 290, 840, 50) }

const LOOKS: Look[] = [
  { name: 'Glide', say: 'A shadow about half the screen wide crosses once in 3.6 s. Nothing reacts', pass: glide },
  { name: 'Prey scatter', say: 'The same pass. Moths and mayflies under it fly out from under the shadow', pass: glide, scatter: true },
  { name: 'Real size', say: 'A real eagle at pond scale: wings wider than the screen, so only part of it is ever seen. 2.4 s', pass: { span: 860, alpha: .3, time: 2.4, at: line(-520, 260, 1160, 100) } },
  {
    name: 'Circling high', say: 'Smaller and fainter, as if far above, curving through the top left corner and away. 6 s',
    pass: { span: 210, alpha: .16, time: 6, at: u => { const a = -.5 + 2.8 * u; return [120 + Math.cos(a) * 240, -60 + Math.sin(a) * 240, a + Math.PI / 2] } },
  },
  { name: 'Dragonfly hides', say: 'The same pass as 1. The dragonfly drops onto the nearest rest spot and waits until it has gone', pass: glide, hide: true },
]

function shadow(g: Ctx, p: Pass, u: number, t: number) {
  const [x, y, a] = p.at(u), s = p.span / 4, flex = 1 - .05 * Math.sin(t * 1.6)
  half.clearRect(0, 0, W / 2, H / 2)
  half.save()
  half.translate(x / 2, y / 2)
  half.rotate(a)
  half.beginPath()
  OUTLINE.forEach(([px, py], i) => half[i ? 'lineTo' : 'moveTo'](px * s, py * s * flex))
  half.closePath()
  half.fillStyle = INK
  half.fill()
  half.restore()
  const img = half.getImageData(0, 0, W / 2, H / 2), d = img.data
  for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 110 ? 255 : 0
  half.putImageData(img, 0, 0)
  g.save()
  g.imageSmoothingEnabled = false
  g.globalAlpha = p.alpha
  g.drawImage(half.canvas, 0, 0, W, H)
  g.restore()
}

pack.got = 2

function figure(host: HTMLElement, n: number, look: Look) {
  const fig = host.appendChild(document.createElement('figure')), out = ctx(fig.appendChild(mk(W, H))), sim = hunt(), { fly, prey } = sim
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n}</b>${look.name}<i>${look.say}</i></figcaption>`)
  let hid = false
  return (t: number, dt: number) => {
    const u = (t % LOOP - START) / look.pass.time, on = u > 0 && u < 1, [sx, sy] = look.pass.at(Math.max(0, Math.min(1, u)))
    sim.stamina = 100
    prey.step(dt, t, fly.x, fly.y, null)
    if (look.scatter && on) for (const p of prey.list) {
      const d = Math.hypot(p.x - sx, p.y - sy)
      if (PREY[p.kind].zone === 'swarm' || d > look.pass.span * .45) continue
      p.wait = 0
      p.x += (p.x - sx) / d * 70 * dt
      p.y += (p.y - sy) / d * 70 * dt
      p.ang = Math.atan2(p.y - sy, p.x - sx)
    }
    if (look.hide && on && !hid) [hid, sim.rest] = [true, sim.near()]
    if (look.hide && hid && !on && u > 1.4) [hid] = [false, sim.leave()]
    if (sim.rest) perch(sim, sim.rest, dt)
    else sim.roam(dt)
    fly.step(dt, t)
    sim.fx.step(dt)
    render(out, sim, t, false, null, false)
    if (on) shadow(out, look.pass, u, t)
  }
}

const figs = LOOKS.map((look, i) => figure(document.querySelector('section')!, i + 1, look))
let clock = 0, last = performance.now()

function tick(dt: number) {
  clock += dt
  figs.forEach(f => f(clock, dt))
}

const loop = () => {
  const now = performance.now()
  tick(Math.min(.05, (now - last) / 1000))
  last = now
  requestAnimationFrame(loop)
}
Object.assign(window, { tick })
if (!location.search) requestAnimationFrame(loop)
