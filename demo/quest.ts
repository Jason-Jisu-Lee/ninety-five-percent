import song from '../assets/audio/soundtrack/02_ninety_five.ogg'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { FOREST as C, UI } from '../data/look/palette'
import { W } from '../data/look/screen'
import { blood } from '../ui/blood/blood'
import { drop } from '../ui/parts/icons'
import { panel } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { pond } from '../world/place/pond'
import navShot from './quest-nav.png'
import one from './sounds/quest1.wav'
import two from './sounds/quest2.wav'
import three from './sounds/quest3.wav'
import four from './sounds/quest4.wav'
import five from './sounds/quest5.wav'

type S = { t: number; go: number; hot: boolean; rang: boolean }
type Box = [x: number, y: number, w: number, h: number]
type Option = { to: string; name: string; note: string; auto?: number; fly?: [number, number]; swap: number; card?: boolean; button?: Box; draw(g: Ctx, s: S, since: number): void }

const SH = 84, K = 2, KILL = 1.2, PAY = 5, FLY = .45, GAP = .09, HOLD = 2.6, LOUD = .6, R = W - 8
const OLD = 'Catch 3 fruit flies', NEW = 'View prey details (click prey) while resting'
const SOUNDS: [string, string][] = [['Two soft bells', one], ['Four notes rising', two], ['One bell', three], ['Coin', four], ['Sparkle', five]]
const TICK = ['......#', '.....##', '#...##.', '##.##..', '.###...', '..#....']
const art = pond(12).art, nav = Object.assign(new Image(), { src: navShot }), low = ctx(mk(W, SH)), music = Object.assign(new Audio(song), { loop: true, volume: LOUD })
const BTN: Box = [R - 60, 46, 60, 15], CARD: Box = [R - 132, 33, 132, 46], CBTN: Box = [R - 8 - 46, 60, 46, 14], TOAST: Box = [W / 2 - 80, 6, 160, 31]
let sound = 0, ear = -1

const ease = (u: number) => Math.max(0, Math.min(1, u)) ** 2
const inside = (x: number, y: number, [bx, by, w, h]: Box) => x >= bx && x < bx + w && y >= by && y < by + h
const landed = (s: S) => s.go < 0 ? 0 : Math.max(0, Math.min(PAY, Math.floor((s.t - s.go - FLY) / GAP) + 1))
const ink = (g: Ctx, x: number, y: number) => {
  for (let i = 0; i < 9; i++) drop(g, x - 1 + i % 3, y - 1 + (i / 3 | 0), UI.panel)
  drop(g, x, y, C.red)
}

function check(g: Ctx, x: number, y: number) {
  for (const [col, n] of [[UI.panel, 9], [UI.accent, 1]] as const) for (let k = 0; k < n; k++) {
    g.fillStyle = col
    TICK.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) if (row[i] === '#') g.fillRect(x + i + (n > 1 ? k % 3 - 1 : 0), y + j + (n > 1 ? (k / 3 | 0) - 1 : 0), 1, 1)
    })
  }
}

function quest(g: Ctx, name: string, sub: string, col: string, dx = 0, done = false) {
  text(g, name, R + dx, 41, col, 'r', UI.panel)
  if (sub) text(g, sub, R + dx, 53, UI.accent, 'r', UI.panel)
  if (done) check(g, R + dx - width(name) - 11, 35)
}

function next(g: Ctx, u: number) {
  if (u > 0) quest(g, NEW, '0 / 1', UI.text, (1 - ease(u)) * 260)
}

function button(g: Ctx, [x, y, w, h]: Box, s: S, reward = true) {
  panel(g, x, y, w, h, s.hot ? UI.accent : s.t * 2 % 1 < .5 ? UI.gold : UI.border, UI.panel)
  text(g, 'Claim', reward ? x + 7 : x + w / 2, y + 11, s.hot ? UI.accent : UI.text, reward ? undefined : 'c')
  if (!reward) return
  text(g, String(PAY), x + w - 7, y + 11, UI.text, 'r')
  drop(g, x + w - 15, y + 7, C.red)
}

const OPTIONS: Option[] = [
  {
    to: 'wait', name: 'Claim button under the quest', note: 'A button replaces the progress count. Drops fly to the counter on the click. Common in idle and mobile games', fly: [R - 30, 53], swap: 1, button: BTN,
    draw(g, s, since) {
      if (since < 1) quest(g, OLD, s.t < KILL ? '2 / 3' : '', s.t < KILL ? UI.text : UI.gold, 0, s.t >= KILL)
      if (s.t >= KILL && s.go < 0) button(g, BTN, s)
    },
  },
  {
    to: 'wait', name: 'Reward card', note: 'A card slides over the quest and stays until claimed. The game keeps running. Common in role playing games', fly: [CARD[0] + 11, CARD[1] + 37], swap: .1, card: true, button: CBTN,
    draw(g, s, since) {
      const dx = s.go < 0 ? (1 - ease((s.t - KILL) / .25)) * 150 : ease((since - .15) / .25) * 150, [x, y, w, h] = CARD
      if (s.t < KILL) return quest(g, OLD, '2 / 3', UI.text)
      if (dx >= 150) return
      panel(g, x + dx, y, w, h, UI.border, UI.panel)
      text(g, 'Quest complete', x + dx + 8, y + 13, UI.accent)
      text(g, OLD, x + dx + 8, y + 25, UI.text)
      drop(g, x + dx + 11, y + 37, C.red)
      text(g, String(PAY), x + dx + 18, y + 41, UI.text)
      if (s.go < 0) button(g, [CBTN[0] + dx, CBTN[1], CBTN[2], CBTN[3]], s, false)
    },
  },
  {
    to: 'auto', name: 'Drops fly to the counter', note: 'The quest gets a tick, five drops fly across, the counter climbs one by one. Hollow Knight, Hades, most mobile games', auto: .35, fly: [R - 12, 50], swap: 1,
    draw(g, s, since) {
      if (since < 1) quest(g, OLD, s.t < KILL ? '2 / 3' : '3 / 3', s.t < KILL ? UI.text : UI.gold, 0, s.t >= KILL)
    },
  },
  {
    to: 'auto', name: 'Tick and reward at the quest', note: 'The quest gets a tick and shows its reward. The counter jumps and glows. The usual quest tracker of role playing games', auto: 0, swap: 1.6,
    draw(g, s, since) {
      if (since >= 1.6) return
      quest(g, OLD, s.t < KILL ? '2 / 3' : '', s.t < KILL ? UI.text : UI.gold, 0, s.t >= KILL)
      if (since < 0) return
      text(g, '+' + PAY, R, 53, UI.text, 'r', UI.panel)
      ink(g, R - width('+' + PAY) - 6, 49)
      if (since < .9) text(g, '+' + PAY, 44, 19 - Math.round(since * 10), C.red, undefined, UI.panel)
    },
  },
  {
    to: 'auto', name: 'Banner at the top', note: 'A banner drops in for two seconds and the next quest takes over at once. The style of Steam and console achievements', auto: 0, swap: 0,
    draw(g, s, since) {
      const [x, , w, h] = TOAST, y = -h + (TOAST[1] + h) * (since < 1 ? ease(since / .25) : 1 - ease((since - 2.45) / .25)), all = width(OLD) + 14 + width('+' + PAY), left = W / 2 - all / 2
      if (s.t < KILL) return quest(g, OLD, '2 / 3', UI.text)
      if (since > 2.7) return
      panel(g, x, y, w, h, UI.border, UI.panel)
      text(g, 'Quest complete', W / 2, y + 13, UI.accent, 'c')
      text(g, OLD, left, y + 25, UI.text)
      drop(g, left + width(OLD) + 8, y + 21, C.red)
      text(g, '+' + PAY, left + all, y + 25, UI.text, 'r')
    },
  },
]

function frame(g: Ctx, o: Option, s: S) {
  const since = s.go < 0 ? -1 : s.t - s.go, got = s.t < KILL ? 0 : 1 + (o.fly ? landed(s) : s.go < 0 ? 0 : PAY), age = s.t - KILL
  const lit = o.fly ? landed(s) > 0 && since - FLY - (landed(s) - 1) * GAP < .12 : since >= 0 && since < .8
  g.drawImage(art, 0, 0)
  blood(g, 2 + got)
  if (lit) text(g, String(2 + got), 24, 19, UI.gold, undefined, UI.panel)
  if (age >= 0 && age < .7) text(g, '+1', 236, Math.round(70 - age * 22), C.red, 'c', UI.panel)
  o.draw(g, s, since)
  if (since >= o.swap) {
    if (!o.card && since < o.swap + .3) quest(g, OLD, '', UI.gold, ease((since - o.swap) / .3) * 220, true)
    next(g, (since - o.swap - .3) / .3)
  }
  if (!o.fly || since < 0) return
  for (let i = 0; i < PAY; i++) {
    const u = (since - i * GAP) / FLY, e = u * u * (3 - 2 * u)
    if (u > 0 && u < 1) ink(g, Math.round(o.fly[0] + (16 - o.fly[0]) * e), Math.round(o.fly[1] + (15 - o.fly[1]) * e - Math.sin(Math.PI * u) * 12))
  }
}

const play = (n: number) => void Object.assign(new Audio(SOUNDS[n][1]), { volume: LOUD }).play().catch(() => {})
const add = (label: string, run: (b: HTMLButtonElement) => void) => {
  const b = document.getElementById('sounds')!.appendChild(document.createElement('button'))
  b.innerHTML = label
  b.onclick = () => run(b)
  return b
}
const keys = SOUNDS.map(([name], n) => add(`<b>${n + 1}</b>${name}`, () => play(sound = n)))
add('Game music under it: off', b => {
  if (music.paused) music.play().catch(() => {})
  else music.pause()
  b.textContent = `Game music under it: ${music.paused ? 'off' : 'on'}`
  b.setAttribute('aria-pressed', String(!music.paused))
})

const views = OPTIONS.map((o, n) => {
  const fig = document.getElementById(o.to)!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(W * K, SH * K)), g = ctx(c), s: S = { t: 0, go: -1, hot: false, rang: false }
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${o.name} <i>${o.note}</i></figcaption>`)
  g.imageSmoothingEnabled = false
  c.onmousemove = e => {
    ear = n
    s.hot = !!o.button && s.t >= KILL && s.go < 0 && inside(e.offsetX / K, e.offsetY / K, o.button)
    c.style.cursor = s.hot ? 'pointer' : ''
  }
  c.onmouseleave = () => s.hot = false
  c.onclick = () => {
    if (!s.hot) return
    ;[s.go, s.hot] = [s.t, false]
    c.style.cursor = ''
  }
  return (dt: number) => {
    s.t += dt
    if (o.auto !== undefined && s.go < 0 && s.t >= KILL + o.auto) s.go = KILL + o.auto
    if (s.t >= KILL && !s.rang) {
      s.rang = true
      if (ear === n) play(sound)
    }
    if (s.go >= 0 && s.t - s.go > Math.max(o.swap + .6, 2.7) + HOLD) Object.assign(s, { t: 0, go: -1, rang: false })
    fig.classList.toggle('on', ear === n)
    frame(low, o, s)
    g.drawImage(low.canvas, 0, 0, W * K, SH * K)
    if (nav.complete) g.drawImage(nav, W * K - nav.width, 0)
  }
})

let last = 0
function tick(now: number) {
  requestAnimationFrame(tick)
  const dt = Math.min(.05, (now - last) / 1000)
  last = now
  keys.forEach((b, n) => b.setAttribute('aria-pressed', String(sound === n)))
  views.forEach(v => v(dt))
}
requestAnimationFrame(tick)
