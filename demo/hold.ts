import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { RECALL } from '../data/game/map'
import { LAIR } from '../data/look/lair'
import { UI } from '../data/look/palette'
import { POINTER } from '../data/look/pointer'
import { H, W } from '../data/look/screen'
import { disc, sweep } from '../ui/parts/disc'
import { note } from '../ui/parts/note'
import { text } from '../ui/text/text'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'

type State = { hot: boolean; was: boolean; cast: number; lit: number; since: number; tap: number; fall: number }
type Look = { name: string; say: string; tip?: string[]; drain?: boolean; under?: (g: Ctx, s: State) => void; art?: (g: Ctx, s: State) => boolean; over?: (g: Ctx, s: State) => void }

const K = 3, R = 16, CX = 8 + R, CY = H - 8 - R, VIEW = [0, 256, 176, 104], TIP = ['Return to Lair', 'End this run'], AWAY = [118, 326], SPOT = [CX + 4, CY + 3]
const GO = 3.2, AT = 3.8, TAP = 5.6, HOLD = 7.9, UP = 10.05, BACK = 10.9, LOOP = 12.5, GHOST = 3.2
const INK: Record<string, string[]> = { '#': [UI.text, UI.gold], o: [UI.text, UI.gold], s: ['#a8a294', '#8f7642'] }
const sim = hunt(), back = ctx(mk(W, H)), low = ctx(mk(W, H)), steps = [...document.querySelectorAll('#steps span')]
let clock = 0, last = performance.now()

const shake = (t: number) => t < RECALL.shake ? Math.round(Math.sin(t / RECALL.shake * Math.PI * 6) * 2) : 0
const word = (g: Ctx, col: string, dx = 0) => text(g, 'Hold', CX + R + 5 + dx, CY + 3, col, undefined, UI.panel)
const peek = (t: number) => t < .25 ? 1 - (1 - t / .25) ** 2 : t < .4 ? 1 : Math.max(0, 1 - (t - .4) / .4)

function arrow(g: Ctx, x: number, y: number, see = 1) {
  g.globalAlpha = see
  POINTER.forEach((row, j) => [...row].forEach((ch, i) => {
    g.fillStyle = ch === '#' ? UI.panel : UI.text
    g.fillRect(Math.round(x) + i, Math.round(y) + j, 1, 1)
  }))
  g.globalAlpha = 1
}

function fly(g: Ctx, hot: boolean) {
  LAIR.forEach((row, j) => [...row].forEach((ch, i) => {
    if (ch === '.') return
    g.fillStyle = INK[ch][+hot]
    for (const x of i ? [CX - i, CX + i] : [CX]) g.fillRect(x, CY - 11 + j, 1, 1)
  }))
}

const LOOKS: Look[] = [
  { name: 'Hover text', say: 'The hover text starts with the word. Nothing else is added', tip: ['Hold to return to Lair', 'End this run'] },
  { name: 'Word beside the badge', say: 'Always on screen, gold while the pointer is on the badge', over: (g, s) => word(g, s.hot ? UI.gold : UI.text) },
  { name: 'Word inside the badge', say: 'The dragonfly gives way to the word while the pointer is on the badge', art: (g, s) => s.hot && (text(g, 'Hold', CX, CY + 3, UI.gold, 'c'), true) },
  { name: 'Shade preview', say: 'When the pointer lands on the badge the shade starts by itself, then falls back', under: (g, s) => s.hot && s.cast < 0 && s.lit >= RECALL.flash && sweep(g, CX, CY, R - 1, peek(s.since) / 3, UI.text) },
  { name: 'Quick click answer', say: 'Let go too early and the shade falls back while the word pops up with a shake', drain: true, over: (g, s) => s.cast < 0 && s.tap < 1.2 && word(g, UI.gold, shake(s.tap)) },
  {
    name: 'Ghost pointer', say: 'A faint pointer presses the badge and the shade fills, only while the Visit the Lair quest is up',
    under: (g, s) => {
      const t = clock % GHOST
      if (!s.hot && t >= .4 && t < 1.95) sweep(g, CX, CY, R - 1, Math.min(1, (t - .4) / 1.4), t < 1.8 ? UI.text : '#fff')
    },
    over: (g, s) => {
      const t = clock % GHOST
      if (!s.hot && t < 2.2) arrow(g, SPOT[0], SPOT[1] + +(t >= .4 && t < 1.95), .55)
    },
  },
]

function act(t: number): [number, number, boolean] {
  const k = t < GO ? 0 : t < AT ? (t - GO) / (AT - GO) : t < BACK ? 1 : Math.max(0, 1 - (t - BACK) / (AT - GO)), e = k * k * (3 - 2 * k)
  return [AWAY[0] + (SPOT[0] - AWAY[0]) * e, AWAY[1] + (SPOT[1] - AWAY[1]) * e, t >= TAP && t < TAP + .15 || t >= HOLD && t < UP]
}

function figure(host: HTMLElement, n: number, look: Look) {
  const fig = host.appendChild(document.createElement('figure')), c = fig.appendChild(mk(VIEW[2] * K, VIEW[3] * K)), out = ctx(c)
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n}</b>${look.name}<i>${look.say}</i></figcaption>`)
  const s: State = { hot: false, was: false, cast: -1, lit: 9, since: 9, tap: 9, fall: 0 }
  let real = false, mx = 0, my = 0, down = false
  c.onmousemove = e => [real, mx, my] = [true, VIEW[0] + e.offsetX / K, VIEW[1] + e.offsetY / K]
  c.onmouseleave = () => [real, down] = [false, false]
  c.onmousedown = e => (e.preventDefault(), down = true)
  addEventListener('mouseup', () => down = false)
  return (dt: number, play: [number, number, boolean]) => {
    const [x, y, d] = real ? [mx, my, down] : play, on = Math.hypot(x - CX, y - CY) < R + 1
    if (on && !s.hot) s.since = 0
    if (d && !s.was && on) s.cast = 0
    if (s.cast >= 0 && !(d && on)) [s.fall, s.tap, s.cast] = [s.cast / RECALL.time, on ? 0 : s.tap, -1]
    else if (s.cast >= 0 && (s.cast += dt) >= RECALL.time) [s.cast, s.lit] = [-1, 0]
    Object.assign(s, { hot: on, was: d, since: s.since + dt, tap: s.tap + dt, lit: s.lit + dt })
    const flash = s.lit < RECALL.flash, part = s.cast >= 0 ? s.cast / RECALL.time : flash ? 1 : look.drain && s.tap < .3 ? s.fall * (1 - s.tap / .3) : 0
    low.drawImage(back.canvas, 0, 0)
    disc(low, CX, CY, R, on ? UI.gold : UI.line)
    if (part) sweep(low, CX, CY, R - 1, part, flash ? '#fff' : UI.text)
    look.under?.(low, s)
    if (!look.art?.(low, s)) fly(low, on)
    look.over?.(low, s)
    if (on) note(low, look.tip ?? TIP, CX - R, CY - R - 4, false, true)
    arrow(low, x, y)
    out.imageSmoothingEnabled = false
    out.drawImage(low.canvas, VIEW[0], VIEW[1], VIEW[2], VIEW[3], 0, 0, VIEW[2] * K, VIEW[3] * K)
  }
}

const figs = LOOKS.map((look, i) => figure(document.querySelector('section')!, i + 1, look))

function tick(dt: number) {
  const t = (clock += dt) % LOOP
  sim.idle(dt, clock)
  render(back, sim, clock, true, null, false)
  steps.forEach((el, i) => el.classList.toggle('on', i === (t < GO || t >= BACK ? 0 : t < TAP ? 1 : t < HOLD ? 2 : 3)))
  figs.forEach(f => f(dt, act(t)))
}

const loop = () => {
  const now = performance.now()
  tick(Math.min(.05, (now - last) / 1000))
  last = now
  requestAnimationFrame(loop)
}
Object.assign(window, { tick })
if (!location.search) requestAnimationFrame(loop)
