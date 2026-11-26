import './seed'
import { veil } from '../core/draw/dissolve'
import { pack } from '../core/save/wild'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { FLY } from '../data/dragonfly/flight'
import { LAIR } from '../data/look/lair'
import { UI } from '../data/look/palette'
import { POINTER } from '../data/look/pointer'
import { H, W } from '../data/look/screen'
import { disc } from '../ui/parts/disc'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'

type Look = (g: Ctx, part: number, col: string, dx: number) => void
const K = 2, R = 16, CX = 8 + R, CY = H - 8 - R, VIEW = [0, 200, 320, 160], SPOT = [150, 292], CLICK = 1.4, CAST = 2, STRIKE = CLICK + 1.25, LOOP = 7.5, SHAKE = .24
const INK: Record<string, string[]> = { '#': [UI.text, UI.gold], o: [UI.text, UI.gold], '+': ['#77756a', '#6b5a35'], s: ['#a8a294', '#8f7642'] }
const low = ctx(mk(W, H)), turn = (dx: number, dy: number) => (Math.atan2(dx, -dy) / (Math.PI * 2) + 1) % 1, figs: ((dt: number) => void)[] = []

function sweep(g: Ctx, from: number, to: number, part: number, col: string, dx: number, see = 1) {
  g.fillStyle = col
  g.globalAlpha = see
  for (let j = -to; j <= to; j++) for (let i = -to; i <= to; i++) {
    const far = Math.hypot(i, j)
    if (far >= from && far <= to + .4 && turn(i, j) < part) g.fillRect(CX + i + dx, CY + j, 1, 1)
  }
  g.globalAlpha = 1
}

const LOOKS: [string, string, Look, boolean?][] = [
  ['Ring', 'The thin ring of the badge fills, clockwise from the top', (g, part, col, dx) => sweep(g, 14.6, 16, part, col, dx)],
  ['Clock', 'A lighter shade sweeps over the whole badge like a clock hand, under the dragonfly', (g, part, col, dx) => sweep(g, 0, 15, part, col, dx, .3), true],
  ['Outer ring', 'A thicker ring of its own fills around the badge', (g, part, col, dx) => (sweep(g, 18.2, 20.4, 1, UI.panel, 0, .7), sweep(g, 18.2, 20.4, part, col, dx))],
]

function badge(g: Ctx, hot: boolean) {
  LAIR.forEach((row, j) => [...row].forEach((ch, i) => {
    g.fillStyle = INK[ch]?.[+hot]
    if (ch !== '.') for (const x of i ? [CX - i, CX + i] : [CX]) g.fillRect(x, CY - 11 + j, 1, 1)
  }))
}

function figure(host: HTMLElement, n: number, [name, say, look, under]: typeof LOOKS[number], hit: boolean) {
  const fig = host.appendChild(document.createElement('figure')), out = ctx(fig.appendChild(mk(VIEW[2] * K, VIEW[3] * K)))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n}</b>${name}: ${hit ? 'cancelled when the Ladybird strikes' : 'completes'}<i>${say}</i></figcaption>`)
  let sim = hunt(), t = LOOP, clock = 0, broke = -1, gone = false, dusk = 0, was = 0
  figs.push(dt => {
    if ((t += dt) >= LOOP) {
      ;[sim, t, broke, gone, dusk] = [hunt(), 0, -1, false, 0]
      Object.assign(sim.fly, { x: SPOT[0], y: SPOT[1], ang: 0 })
      const bug = sim.prey.list.find(p => p.kind === 'ladybird')
      if (hit && bug) Object.assign(bug, { x: sim.ahead(DF.headAt)[0], y: sim.ahead(DF.headAt)[1], free: 0 }), sim.mark = bug
      was = sim.health
    }
    clock += dt
    if (hit || gone) sim.step(dt, clock)
    else sim.prey.step(dt, clock, -999, -999, null), sim.fly.seek(SPOT[0], SPOT[1], sim.fly.top() * FLY.cruise, dt), sim.fly.step(dt, clock), sim.fx.step(dt)
    if (sim.health < was && broke < 0) broke = t
    was = sim.health
    if (hit) sim.strike = t >= STRIKE && broke < 0 ? 0 : 99
    const part = t < CLICK || broke >= 0 && t - broke > SHAKE ? 0 : Math.min(1, ((broke < 0 ? t : broke) - CLICK) / CAST), done = !hit && t >= CLICK + CAST
    if (done && !gone) gone = true, sim.feast()
    if (gone && sim.fly.x < -FLY.gone) dusk = Math.min(1, dusk + dt * 2)
    const lit = t >= CLICK - .4, col = broke >= 0 ? UI.foe : done && t < CLICK + CAST + .15 ? '#fff' : UI.text, dx = broke >= 0 ? Math.round(Math.sin((t - broke) / SHAKE * Math.PI * 6) * 2) : 0
    render(low, sim, clock, true, null, false)
    disc(low, CX, CY, R, lit ? UI.gold : UI.line)
    if (under && part && t < CLICK + CAST + .15) look(low, part, col, dx)
    badge(low, lit)
    if (!under && part && t < CLICK + CAST + .15) look(low, part, col, dx)
    if (lit) POINTER.forEach((row, j) => [...row].forEach((ch, i) => {
      low.fillStyle = ch === '#' ? UI.panel : UI.text
      low.fillRect(CX + 5 + i, CY + 4 + j + +(t >= CLICK && t < CLICK + .12), 1, 1)
    }))
    if (dusk) veil(low, dusk)
    out.imageSmoothingEnabled = false
    out.drawImage(low.canvas, VIEW[0], VIEW[1], VIEW[2], VIEW[3], 0, 0, VIEW[2] * K, VIEW[3] * K)
  })
}

pack.got = 3
const host = document.querySelector('section')!
LOOKS.forEach((look, i) => [false, true].forEach(hit => figure(host, i + 1, look, hit)))
let last = performance.now()
const loop = () => {
  const now = performance.now(), dt = Math.min(.05, (now - last) / 1000)
  last = now
  figs.forEach(f => f(dt))
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
