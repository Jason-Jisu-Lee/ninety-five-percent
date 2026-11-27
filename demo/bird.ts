import { save } from '../core/save/save'
import { pack } from '../core/save/wild'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { H, W } from '../data/look/screen'
import { PREY } from '../data/enemies/enemies'
import { UI } from '../data/look/palette'
import { hud } from '../ui/hud/hud'
import { text, width } from '../ui/text/text'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'

type Look = { name: string; say: string; draw: (g: Ctx, u: number, sx: number, sy: number) => void }

const LOOP = 13, CRY = 1, SAY = 1.8, START = 3, PASS = 4.8, SPAN = 300, ALPHA = .32, INK = '#0b1a14', LINE = 'Something big is coming', HOLD = 3.6
const WING = [[.4, 0], [.33, .045], [.22, .07], [.2, .3], [.14, .62], [.08, .86], [.07, .98], [.03, .93], [.02, 1], [-.02, .94], [-.04, .99], [-.08, .92], [-.1, .95], [-.13, .86], [-.18, .62], [-.16, .3], [-.12, .1], [-.2, .09], [-.4, .17], [-.43, .06], [-.44, 0]]
const OUTLINE = [...WING, ...WING.slice(1, -1).reverse().map(([x, y]) => [x, -y])]
const SOUNDS = [
  ['Far cry', 'one distant raptor scream with a little echo, 1.3 s'],
  ['Two calls', 'a short call, then a longer one, far off'],
  ['Wingbeats', 'three slow, heavy wingbeats from far away'],
  ['Air rush', 'wind swelling and fading as something big goes over'],
  ['Cry and air', 'the far cry, then the air rush under it'],
]
const half = ctx(mk(W / 2, H / 2)), from: [number, number] = [-200, 290], to: [number, number] = [840, 50], heading = Math.atan2(to[1] - from[1], to[0] - from[0])
const fade = (u: number) => Math.max(0, Math.min(1, u / .6, (HOLD - u) / 1))

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

function shadow(g: Ctx) {
  g.save()
  g.imageSmoothingEnabled = false
  g.globalAlpha = ALPHA
  g.drawImage(half.canvas, 0, 0, W, H)
  g.restore()
}

function line(g: Ctx, u: number, x: number, y: number, align?: 'c' | 'r', shown = LINE) {
  const a = fade(u)
  if (a <= 0) return
  g.globalAlpha = a
  text(g, shown, x, y, UI.text, align, UI.panel)
  g.globalAlpha = 1
}

const LOOKS: Look[] = [
  { name: 'Bottom centre', say: 'Like a subtitle, low in the middle, clear of the cards and the Lair button', draw: (g, u) => line(g, u, W / 2, H - 22, 'c') },
  { name: 'Middle, small', say: 'In the middle of the pond at normal text size, over the water', draw: (g, u) => line(g, u, W / 2, H / 2 - 36, 'c') },
  { name: 'Under the counter', say: 'Top left, just under the lifeblood counter, where the eye checks often', draw: (g, u) => line(g, u, 10, 40) },
  {
    name: 'With the shadow', say: 'Appears where the shadow will come in and drifts across with it',
    draw: (g, u, sx, sy) => {
      const k = Math.max(0, Math.min(1, (u - (START - SAY)) / PASS)), x = 120 + k * 360, y = 250 - k * 110
      line(g, u, Math.round(x), Math.round(y), 'c')
      void sx
      void sy
    },
  },
  {
    name: 'Typed, bottom centre', say: 'Low in the middle, the letters appear one by one over 1.2 s, then it fades',
    draw: (g, u) => {
      const n = Math.min(LINE.length, Math.floor(u / 1.2 * LINE.length)), left = Math.round(W / 2 - width(LINE) / 2)
      line(g, Math.max(u, .6), left, H - 22, undefined, LINE.slice(0, n))
    },
  },
]

Object.assign(save, { quest: 9, count: 1, fed: true, told: true, tired: true, warned: true, blood: 140, caught: { fruitfly: 9, moth: 4, mayfly: 2, ladybird: 1 } })
pack.got = 3

const audio = SOUNDS.map((_, i) => new Audio(`./sounds/bird${i + 1}.wav`))
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

const none = () => {}

function figure(host: HTMLElement, n: number, look: Look) {
  const fig = host.appendChild(document.createElement('figure')), out = ctx(fig.appendChild(mk(W, H))), sim = hunt(), { fly, prey } = sim, ui = hud(none, none, none, none, none, none, [])
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n}</b>${look.name}<i>${look.say}</i></figcaption>`)
  return (t: number, dt: number) => {
    const c = t % LOOP, u = (c - START) / PASS, on = u > 0 && u < 1, sx = from[0] + (to[0] - from[0]) * u, sy = from[1] + (to[1] - from[1]) * u
    sim.stamina = 100
    prey.step(dt, t, fly.x, fly.y, null)
    if (on) for (const p of prey.list) {
      const d = Math.hypot(p.x - sx, p.y - sy)
      if (PREY[p.kind].zone === 'swarm' || d > SPAN * .45) continue
      p.wait = 0
      p.x += (p.x - sx) / d * 70 * dt
      p.y += (p.y - sy) / d * 70 * dt
      p.ang = Math.atan2(p.y - sy, p.x - sx)
    }
    sim.roam(dt)
    fly.step(dt, t)
    sim.fx.step(dt)
    render(out, sim, t, false, null, false)
    if (on) shadow(out)
    ui.draw(out, false)
    look.draw(out, c - SAY, sx, sy)
  }
}

const figs = LOOKS.map((look, i) => figure(document.querySelector('section')!, i + 1, look))
let clock = 0, last = performance.now()

function tick(dt: number) {
  const was = clock % LOOP
  clock += dt
  const u = (clock % LOOP - START) / PASS
  if (u > 0 && u < 1) cast(from[0] + (to[0] - from[0]) * u, from[1] + (to[1] - from[1]) * u, clock)
  if (was < CRY && clock % LOOP >= CRY && !location.search) {
    audio[pick].currentTime = 0
    audio[pick].play().catch(() => {})
  }
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
