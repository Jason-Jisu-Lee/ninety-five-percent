import './seed'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { H, W } from '../data/look/screen'
import { PREY } from '../data/enemies/enemies'
import { UI } from '../data/look/palette'
import { hud } from '../ui/hud/hud'
import { text, width } from '../ui/text/text'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'

type Look = { name: string; say: string; draw: (g: Ctx, u: number) => void }

const LOOP = 9, CRY = .4, SAY = 1, START = 2, PASS = 4.8, SPAN = 300, ALPHA = .32, INK = '#0b1a14', LINE = 'Something big is out there', HOLD = 6.8, TYPE = 1.2, Y = H - 22
const WING = [[.4, 0], [.33, .045], [.22, .07], [.2, .3], [.14, .62], [.08, .86], [.07, .98], [.03, .93], [.02, 1], [-.02, .94], [-.04, .99], [-.08, .92], [-.1, .95], [-.13, .86], [-.18, .62], [-.16, .3], [-.12, .1], [-.2, .09], [-.4, .17], [-.43, .06], [-.44, 0]]
const OUTLINE = [...WING, ...WING.slice(1, -1).reverse().map(([x, y]) => [x, -y])]
const SOUNDS = [
  ['Lower', 'number 2 as you heard it'],
  ['A little', 'a little softer, darker and echoier'],
  ['More', 'softer, darker, a longer echo, like Farther'],
  ['Most', 'the softest and darkest, the longest echo'],
]
const half = ctx(mk(W / 2, H / 2)), scene = ctx(mk(W, H)), from: [number, number] = [-200, 290], to: [number, number] = [840, 50], heading = Math.atan2(to[1] - from[1], to[0] - from[0])
const LEFT = Math.round(W / 2 - width(LINE) / 2), FULL = width(LINE)
const alpha = (u: number) => u < 0 ? 0 : Math.max(0, Math.min(1, (HOLD - u) / 1))
const typed = (u: number) => Math.max(0, Math.min(LINE.length, Math.floor(u / TYPE * LINE.length)))

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

const film = (g: Ctx, u: number, h: number, top: boolean, k = 1) => {
  const a = alpha(u), n = Math.round(h * Math.min(1, Math.max(0, u / .4)) * Math.min(1, a * 1.5))
  if (n <= 0) return false
  g.globalAlpha = k
  g.fillStyle = '#000'
  if (top) g.fillRect(0, 0, W, n)
  g.fillRect(0, H - n, W, n)
  g.globalAlpha = 1
  return true
}
const gray = (g: Ctx, u: number, pad: number, h: number, fill: string, k: number, w = FULL + pad * 2) => (shade(g, u, W / 2 - w / 2 | 0, Y - 4 - (h >> 1), w, h, fill, k), plain(g, u, Y, undefined))

const LOOKS: Look[] = [
  { name: 'Gray box', say: 'As shown before: see-through gray, sized to the whole line', draw: (g, u) => gray(g, u, 6, 15, '#2a2e2d', .7) },
  { name: 'Dark box', say: 'Almost black, see-through, more room around the words', draw: (g, u) => gray(g, u, 10, 19, '#0d1110', .6) },
  { name: 'Wide box', say: 'See-through gray, a fixed wider box so the words sit well inside it', draw: (g, u) => gray(g, u, 0, 17, '#2a2e2d', .65, FULL + 60) },
  {
    name: 'Soft corners', say: "See-through gray with its corners cut by one pixel, like the game's other boxes",
    draw: (g, u) => {
      const w = FULL + 16, x = W / 2 - w / 2 | 0, y = Y - 12
      shade(g, u, x + 1, y, w - 2, 17, '#2a2e2d', .7)
      shade(g, u, x, y + 1, 1, 15, '#2a2e2d', .7)
      shade(g, u, x + w - 1, y + 1, 1, 15, '#2a2e2d', .7)
      plain(g, u, Y, undefined)
    },
  },
  { name: 'Film bars', say: 'As shown before: black bars top and bottom, the line in the bottom bar', draw: (g, u) => film(g, u, 20, true) && plain(g, u, H - 7, undefined) },
  { name: 'Thin bars', say: 'Thinner black bars, 14 pixels instead of 20', draw: (g, u) => film(g, u, 14, true) && plain(g, u, H - 4, undefined) },
  { name: 'Bottom bar only', say: 'Only the bottom bar slides in; the top of the screen stays clear', draw: (g, u) => film(g, u, 20, false) && plain(g, u, H - 7, undefined) },
  { name: 'See-through bars', say: 'Film bars at 70%, so the Lair badge and the cards still show through', draw: (g, u) => film(g, u, 20, true, .7) && plain(g, u, H - 7, undefined) },
]

const audio = SOUNDS.map((_, i) => new Audio(`./sounds/low${i + 1}.wav`))
let pick = 0
const buttons = SOUNDS.map(([name, say], i) => {
  const b = document.querySelector('nav')!.appendChild(document.createElement('button'))
  b.innerHTML = `<b>${i + 1}</b> ${name}<i>${say}</i>`
  b.onclick = () => {
    pick = i
    clock = 0
    audio.forEach(a => a.pause())
    buttons.forEach((x, j) => x.classList.toggle('on', j === i))
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
