import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { QUESTS } from '../data/game/quests'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { nav } from '../ui/nav/nav'
import { gauge } from '../ui/parts/bar'
import { icon, orb } from '../ui/parts/icons'
import { pop } from '../ui/quest/pop'
import { text, width } from '../ui/text/text'
import { glow } from '../ui/track/track'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'

type Quest = typeof QUESTS[number]
type Look = { name: string; say: string; draw: (g: Ctx, q: Quest, u: number) => void }

const K = 3, VIEW = [384, 0, 256, 104], R = W - 8, BAR = 64, FAR = 270, SLIDE = .3, DONE = 1, COME = DONE + SLIDE, LOOP = 5.2, BLINK = .27
const none = () => {}, sim = hunt(), back = ctx(mk(W, H)), low = ctx(mk(W, H)), tmp = ctx(mk(W, H)), bar = nav([none, none, none])
let clock = 0, last = performance.now()

const unit = (u: number) => Math.max(0, Math.min(1, u)), ease = (u: number) => unit(u) ** 2
const size = (q: Quest) => Math.max(width(q.text), q.hint ? width(q.hint) : 0, (q.blood ? width('+' + q.blood) + 14 : 0) + BAR + 6 + width(`0 / ${q.n}`))

function rows(g: Ctx, q: Quest, got: number, r: number, dy = 0, flat = '', hint = q.hint) {
  const pay = q.blood ? '+' + q.blood : '', x = r - (pay ? width(pay) + 14 : 0) - BAR, edge = flat ? undefined : UI.panel
  if (flat) g.fillStyle = flat, g.fillRect(x, 48 + dy, BAR, 4)
  else gauge(g, x, 48 + dy, BAR, got / q.n, UI.accent)
  if (pay) text(g, pay, r, 54 + dy, flat || UI.gold, 'r', edge), orb(g, r - width(pay) - 6, 50 + dy, flat, edge)
  text(g, `${got} / ${q.n}`, x - 6, 54 + dy, flat || UI.accent, 'r', edge)
  if (hint) text(g, hint, r, 67 + dy, flat || UI.text, 'r', edge)
}

function track(g: Ctx, q: Quest, got: number, col: string, dx = 0, tick = false, dy = 0, flat = '') {
  const r = R + dx
  text(g, q.text, r, 41 + dy, flat || col, 'r', flat ? undefined : UI.panel)
  rows(g, q, got, r, dy, flat, tick ? '' : q.hint)
  if (tick) icon(g, 'tick', r - width(q.text) - 11, 35, UI.accent, UI.panel)
}

const slide = (g: Ctx, q: Quest, u: number, col: string = UI.text) => track(g, q, 0, col, (1 - ease(u / SLIDE)) * FAR)

function slab(g: Ctx, x: number, y: number, w: number, h: number) {
  if (w < 1) return
  g.fillStyle = UI.panel
  g.fillRect(x - 1, y - 1, w + 2, h + 2)
  g.fillStyle = UI.text
  g.fillRect(x, y, w, h)
}

const LOOKS: Look[] = [
  { name: 'Now', say: 'Slides in from the right. Nothing else', draw: (g, q, u) => slide(g, q, u) },
  {
    name: 'Pop', say: 'What the first quest of the game does: a white flash, a hop and a burst of lines. 0.3 s',
    draw: (g, q, u) => {
      const w = size(q), tall = q.hint ? 6 : 0
      pop(g, u, (to, dy) => track(to, q, 0, UI.text, 0, false, dy), [R - w / 2, 45 + tall, w / 2 + 6, 17 + tall])
    },
  },
  { name: 'Gold blink', say: 'Slides in as now with its words in gold, then blinks gold twice more. 1.1 s', draw: (g, q, u) => slide(g, q, u, u < SLIDE + BLINK * 3 && (u - SLIDE) % BLINK < BLINK * .55 ? UI.gold : UI.text) },
  {
    name: 'Shine', say: 'Slides in as now, then one glint runs across it. 0.9 s',
    draw: (g, q, u) => {
      slide(g, q, u)
      const v = (u - SLIDE - .1) / .5, w = size(q)
      if (v <= 0 || v >= 1) return
      tmp.clearRect(0, 0, W, H)
      track(tmp, q, 0, UI.text)
      tmp.globalCompositeOperation = 'source-in'
      tmp.fillStyle = '#fff'
      tmp.fillRect(0, 0, W, H)
      tmp.globalCompositeOperation = 'source-over'
      for (let y = 30; y < 74; y++) {
        const x = Math.round(R - w - 16 + v * (w + 46) - (y - 30) * .5)
        tmp.clearRect(0, y, x, 1)
        tmp.clearRect(x + 8, y, 2, 1)
        tmp.clearRect(x + 12, y, W, 1)
      }
      g.drawImage(tmp.canvas, 0, 0)
    },
  },
  {
    name: 'Typed', say: 'No slide. The words type in behind a block, then the bar appears. 0.4 to 0.8 s by length',
    draw: (g, q, u) => {
      const len = q.text.length, time = Math.max(.35, Math.min(.8, len / 45)), n = Math.min(len, Math.floor(u / time * len)), left = R - width(q.text), part = q.text.slice(0, n)
      text(g, part, left, 41, UI.text, undefined, UI.panel)
      if (u < time + .12) slab(g, left + width(part) + 2, 34, 4, 8)
      if (n === len) rows(g, q, 0, R)
    },
  },
  {
    name: 'Block wipe', say: 'No slide. A block runs along the words and uncovers them, then the bar appears. 0.5 s',
    draw: (g, q, u) => {
      const w = width(q.text) + 4, left = R - w + 2, a = 1 - (1 - unit(u / .16)) ** 3, v = unit((u - .2) / .3), b = v * v * (3 - 2 * v), from = Math.round(left + w * b)
      g.save()
      g.beginPath()
      g.rect(0, 0, from, H)
      g.clip()
      text(g, q.text, R, 41, UI.text, 'r', UI.panel)
      g.restore()
      slab(g, from, 33, Math.round(left + w * a) - from, 11)
      if (v >= 1) rows(g, q, 0, R)
    },
  },
]

function figure(host: HTMLElement, n: number, look: Look) {
  const fig = host.appendChild(document.createElement('figure')), out = ctx(fig.appendChild(mk(VIEW[2] * K, VIEW[3] * K)))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n || 'Now'}</b>${n ? look.name : ''}<i>${look.say}</i></figcaption>`)
  return (t: number, old: Quest, next: Quest) => {
    low.drawImage(back.canvas, 0, 0)
    bar.draw(low, false, false)
    if (t < COME) track(low, old, old.n, UI.gold, ease((t - DONE) / SLIDE) * FAR, true)
    else look.draw(low, next, t - COME)
    out.imageSmoothingEnabled = false
    out.drawImage(low.canvas, VIEW[0], VIEW[1], VIEW[2], VIEW[3], 0, 0, VIEW[2] * K, VIEW[3] * K)
    out.setTransform(1, 0, 0, 1, -VIEW[0] * K, -VIEW[1] * K)
    glow(out, K, 1, 0)
    out.setTransform(1, 0, 0, 1, 0, 0)
  }
}

const figs = LOOKS.map((look, i) => figure(document.querySelector('section')!, i, look))

function tick(dt: number) {
  const i = Math.floor((clock += dt) / LOOP) % QUESTS.length
  sim.idle(dt, clock)
  render(back, sim, clock, true, null, false)
  figs.forEach(f => f(clock % LOOP, QUESTS[i], QUESTS[(i + 1) % QUESTS.length]))
}

const loop = () => {
  const now = performance.now()
  tick(Math.min(.05, (now - last) / 1000))
  last = now
  requestAnimationFrame(loop)
}
Object.assign(window, { tick })
if (!location.search) requestAnimationFrame(loop)
