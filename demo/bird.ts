import { save } from '../core/save/save'
import { pack } from '../core/save/wild'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { H, W } from '../data/look/screen'
import { PREY } from '../data/enemies/enemies'
import { UI } from '../data/look/palette'
import { hud } from '../ui/hud/hud'
import { box } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'

type Look = { name: string; say: string; draw: (g: Ctx, u: number) => void }

const LOOP = 13, CRY = 1, SAY = 1.8, START = 3, PASS = 4.8, SPAN = 300, ALPHA = .32, INK = '#0b1a14', LINE = 'Something big is coming', HOLD = 3.6, TYPE = 1.2, Y = H - 22
const WING = [[.4, 0], [.33, .045], [.22, .07], [.2, .3], [.14, .62], [.08, .86], [.07, .98], [.03, .93], [.02, 1], [-.02, .94], [-.04, .99], [-.08, .92], [-.1, .95], [-.13, .86], [-.18, .62], [-.16, .3], [-.12, .1], [-.2, .09], [-.4, .17], [-.43, .06], [-.44, 0]]
const OUTLINE = [...WING, ...WING.slice(1, -1).reverse().map(([x, y]) => [x, -y])]
const SOUNDS = [
  ['Far cry', 'the one you picked, unchanged'],
  ['Lower', 'the same cry, deeper and a little longer'],
  ['Shorter', 'a quicker cry, less tail'],
  ['Farther', 'softer and darker, a longer echo'],
  ['Closer', 'drier and a bit rougher, short echo'],
  ['Long fall', 'a longer cry that drops further at the end'],
]
const half = ctx(mk(W / 2, H / 2)), scene = ctx(mk(W, H)), from: [number, number] = [-200, 290], to: [number, number] = [840, 50], heading = Math.atan2(to[1] - from[1], to[0] - from[0])
const LEFT = Math.round(W / 2 - width(LINE) / 2), FULL = width(LINE)
const alpha = (u: number) => u < 0 ? 0 : Math.max(0, Math.min(1, (HOLD - u) / 1))
const typed = (u: number) => Math.max(0, Math.min(LINE.length, Math.floor(u / TYPE * LINE.length)))
const at = (i: number) => LEFT + (i ? width(LINE.slice(0, i)) + 1 : 0)

function cast(x: number, y: number, t: number) {
  const s = SPAN / 4, flex = 1 - .05 * Math.sin(t * 1.6)
  half.clearRect(0, 0, W / 2, H / 2)
  half.save()
  half.translate(x / 2, y / 2)
  half.rotate(heading)
  half.beginPath()
  OUTLINE.forEach(([px, py], i) => half[i ? 'lineTo' : 'moveTo'](px * s, py * s * flex))
  half.closePath()
  half.fillStyle = INK
  half.fill()
  half.restore()
  const img = half.getImageData(0, 0, W / 2, H / 2), d = img.data
  for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 110 ? 255 : 0
  half.putImageData(img, 0, 0)
}

function plain(g: Ctx, u: number, y = Y, edge: string | undefined = UI.panel) {
  const a = alpha(u)
  if (a <= 0) return 0
  g.globalAlpha = a
  text(g, LINE.slice(0, typed(u)), LEFT, y, UI.text, undefined, edge)
  g.globalAlpha = 1
  return a
}

function shade(g: Ctx, u: number, x: number, y: number, w: number, h: number, fill: string, k = 1) {
  const a = alpha(u) * Math.min(1, u / .15)
  if (a <= 0) return
  g.globalAlpha = a * k
  g.fillStyle = fill
  g.fillRect(x, y, w, h)
  g.globalAlpha = 1
}

const LOOKS: Look[] = [
  {
    name: 'Gray box', say: 'A see-through gray box sized to the whole line, the standard subtitle box',
    draw: (g, u) => (shade(g, u, LEFT - 6, Y - 11, FULL + 12, 15, '#2a2e2d', .7), plain(g, u, Y, undefined)),
  },
  {
    name: 'Gray band', say: 'A wider see-through gray band whose ends fade out in steps',
    draw: (g, u) => {
      const w = FULL + 80, x = W / 2 - w / 2
      for (let i = 0; i < 4; i++) shade(g, u, x + i * 8, Y - 12, w - i * 16, 17, '#2a2e2d', .22)
      plain(g, u, Y, undefined)
    },
  },
  { name: 'Plain', say: 'Text with its dark edge and nothing behind it, as typed before', draw: (g, u) => plain(g, u) },
  {
    name: 'Cursor', say: 'A small block cursor leads the letters and blinks twice after the last one',
    draw: (g, u) => {
      const a = plain(g, u), n = typed(u)
      if (!a || u > TYPE + 1.2 || u > TYPE && (u - TYPE) % .6 > .3) return
      g.globalAlpha = a
      g.fillStyle = UI.text
      g.fillRect(at(n) + (n ? 1 : 0), Y - 7, 4, 7)
      g.globalAlpha = 1
    },
  },
  {
    name: 'Film bars', say: 'Black bars slide in at the top and bottom like a film; the line sits in the bottom bar',
    draw: (g, u) => {
      const a = alpha(u), k = Math.min(1, Math.max(0, u / .4)), h = Math.round(20 * k * Math.min(1, a * 1.5))
      if (h <= 0) return
      g.fillStyle = '#000'
      g.fillRect(0, 0, W, h)
      g.fillRect(0, H - h, W, h)
      plain(g, u, H - 7, undefined)
    },
  },
  {
    name: 'Game box', say: 'The game\'s own box, the one the hover notes use, sized to the whole line',
    draw: (g, u) => {
      const a = alpha(u) * Math.min(1, u / .15)
      if (a <= 0) return
      g.globalAlpha = a
      box(g, LEFT - 6, Y - 12, FULL + 12, 17, UI.border, UI.panel)
      g.globalAlpha = 1
      plain(g, u, Y, undefined)
    },
  },
  {
    name: 'Word by word', say: 'Whole words appear one at a time instead of letters',
    draw: (g, u) => {
      const a = alpha(u), words = LINE.split(' '), n = Math.min(words.length, Math.floor(u / TYPE * words.length) + 1)
      if (a <= 0) return
      g.globalAlpha = a
      text(g, words.slice(0, n).join(' '), LEFT, Y, UI.text, undefined, UI.panel)
      g.globalAlpha = 1
    },
  },
  {
    name: 'Soft letters', say: 'Each letter fades in over a quarter second instead of popping in',
    draw: (g, u) => {
      const a = alpha(u)
      if (a <= 0) return
      for (let i = 0; i < LINE.length; i++) {
        const k = Math.max(0, Math.min(1, (u - i / LINE.length * TYPE) / .25))
        if (!k) break
        g.globalAlpha = a * k
        text(g, LINE[i], at(i), Y, UI.text, undefined, UI.panel)
      }
      g.globalAlpha = 1
    },
  },
]

Object.assign(save, { quest: 9, count: 1, fed: true, told: true, tired: true, warned: true, blood: 140, caught: { fruitfly: 9, moth: 4, mayfly: 2, ladybug: 1 } })
pack.got = 3

const audio = SOUNDS.map((_, i) => new Audio(`./sounds/cry${i + 1}.wav`))
let pick = 0
const buttons = SOUNDS.map(([name, say], i) => {
  const b = document.querySelector('nav')!.appendChild(document.createElement('button'))
  b.innerHTML = `<b>${i + 1}</b> ${name}<i>${say}</i>`
  b.onclick = () => {
    pick = i
    buttons.forEach((x, j) => x.classList.toggle('on', j === i))
    audio[i].currentTime = 0
    audio[i].play().catch(() => {})
  }
  return b
})
buttons[0].classList.add('on')

const none = () => {}, sim = hunt(), { fly, prey } = sim, ui = hud(none, none, none, none, none, none, [])
const figs = LOOKS.map((look, i) => {
  const fig = document.querySelector('section')!.appendChild(document.createElement('figure')), out = ctx(fig.appendChild(mk(W, H)))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${i + 1}</b>${look.name}<i>${look.say}</i></figcaption>`)
  return (u: number) => {
    out.drawImage(scene.canvas, 0, 0)
    look.draw(out, u)
  }
})
let clock = 0, last = performance.now()

function tick(dt: number) {
  const was = clock % LOOP
  clock += dt
  const c = clock % LOOP, u = (c - START) / PASS, on = u > 0 && u < 1, sx = from[0] + (to[0] - from[0]) * u, sy = from[1] + (to[1] - from[1]) * u
  if (was < CRY && c >= CRY && !location.search) {
    audio[pick].currentTime = 0
    audio[pick].play().catch(() => {})
  }
  sim.stamina = 100
  prey.step(dt, clock, fly.x, fly.y, null)
  if (on) {
    cast(sx, sy, clock)
    for (const p of prey.list) {
      const d = Math.hypot(p.x - sx, p.y - sy)
      if (PREY[p.kind].zone === 'swarm' || d > SPAN * .45) continue
      p.wait = 0
      p.x += (p.x - sx) / d * 70 * dt
      p.y += (p.y - sy) / d * 70 * dt
      p.ang = Math.atan2(p.y - sy, p.x - sx)
    }
  }
  sim.roam(dt)
  fly.step(dt, clock)
  sim.fx.step(dt)
  render(scene, sim, clock, false, null, false)
  if (on) {
    scene.save()
    scene.imageSmoothingEnabled = false
    scene.globalAlpha = ALPHA
    scene.drawImage(half.canvas, 0, 0, W, H)
    scene.restore()
  }
  ui.draw(scene, false)
  figs.forEach(f => f(c - SAY))
}

const loop = () => {
  const now = performance.now()
  tick(Math.min(.05, (now - last) / 1000))
  last = now
  requestAnimationFrame(loop)
}
Object.assign(window, { tick })
if (!location.search) requestAnimationFrame(loop)
