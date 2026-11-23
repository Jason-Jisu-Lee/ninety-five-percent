import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { W } from '../data/look/screen'
import { frame } from '../ui/parts/frame'
import { text, width } from '../ui/text/text'
import { art, OLD, R, tick, view } from './kit'
import chime from './sounds/quest2.wav'

type Cols = Record<string, string>

const SHOWN: Cols = { '#': '#d8442c', o: '#f6b09c', d: '#9c2a22' }, LESS: Cols = { '#': '#c2442c', o: '#ddb09c', d: '#8c2a22' }
const ROWS = ['.....', '.###.', '#o###', '#####', '###d#', '.###.', '.....']
const SH = 96, KILL = 1.2, PAY = '+5', GOT = 5, WAIT = .35, FLY = .45, GAP = .09, HOLD = 3, SLIDE = .3, REST = 2, FAR = 270, BAR = 64
const NEW = 'View prey details (click prey) while resting', DONE = 'Objective Complete'
let ear = false

const ease = (u: number) => Math.max(0, Math.min(1, u)) ** 2

function orb(g: Ctx, x: number, y: number, cols: Cols, edge = false) {
  for (let k = edge ? 0 : 9; k < 10; k++) ROWS.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] !== '.') {
      g.fillStyle = k < 9 ? UI.panel : cols[row[i]]
      g.fillRect(x - 2 + i + (k < 9 ? k % 3 - 1 : 0), y - 3 + j + (k < 9 ? (k / 3 | 0) - 1 : 0), 1, 1)
    }
  })
}

function amount(g: Ctx, cols: Cols, n: string, right: number, y: number, edge = false, k = 1) {
  text(g, n, right, y, UI.text, 'r', edge ? UI.panel : undefined, k)
  orb(g, right - width(n) * k - 6, y - 4 - (k - 1) * 3, cols, edge)
}

function track(g: Ctx, name: string, got: number, of: number, col: string, dx = 0, done = false) {
  const r = R + dx, x = r - width(PAY) - 14 - BAR
  text(g, name, r, 41, col, 'r', UI.panel)
  g.fillStyle = UI.panel
  g.fillRect(x - 1, 47, BAR + 2, 6)
  g.fillStyle = UI.line
  g.fillRect(x, 48, BAR, 4)
  g.fillStyle = UI.accent
  g.fillRect(x, 48, Math.round(BAR * got / of), 4)
  text(g, PAY, r, 54, UI.gold, 'r', UI.panel)
  orb(g, r - width(PAY) - 6, 50, LESS, true)
  text(g, `${got} / ${of}`, x - 6, 54, UI.accent, 'r', UI.panel)
  if (done) tick(g, r - width(name) - 11, 35)
}

function title(g: Ctx, since: number) {
  const half = width(DONE) + 8
  g.globalAlpha = Math.max(0, Math.min(1, since / .25, (HOLD - since) / .4))
  text(g, DONE, W / 2, 72, UI.gold, 'c', UI.panel, 2)
  text(g, OLD, W / 2, 88, UI.text, 'c', UI.panel)
  for (const s of [-1, 1]) for (const [col, y] of [[UI.panel, 66], [UI.gold, 65]] as const) {
    g.fillStyle = col
    g.fillRect(W / 2 + s * half + (s < 0 ? -36 : 0), y, 36, 1)
  }
  g.globalAlpha = 1
}

const from = [R - width(PAY) - 6, 50], live = view('<b>1</b>All three picks in one catch <i>Title across the screen, progress bar with a gold +5, orb 10% less red</i>', W, SH)
const g = live.low
let t = 0, rang = false
live.c.onmousemove = () => ear = true
live.c.onmouseleave = () => ear = false

function step(dt: number) {
  t += dt
  const since = t - KILL, landed = Math.max(0, Math.min(GOT, Math.floor((since - WAIT - FLY) / GAP) + 1)), got = since < 0 ? 0 : 1 + landed
  if (since >= 0 && !rang) {
    rang = true
    if (ear) void Object.assign(new Audio(chime), { volume: .6 }).play().catch(() => {})
  }
  if (since > HOLD + SLIDE * 2 + REST) [t, rang] = [0, false]
  live.fig.classList.toggle('on', ear)
  g.drawImage(art, 0, 0)
  orb(g, 16, 15, LESS, true)
  const flash = landed && since - WAIT - FLY - (landed - 1) * GAP < .12
  text(g, String(2 + got), 24, 19, flash ? UI.gold : UI.text, undefined, UI.panel)
  if (since >= 0 && since < .7) text(g, '+1', 236, Math.round(84 - since * 22), LESS['#'], 'c', UI.panel)
  if (since < 0) track(g, OLD, 2, 3, UI.text)
  else if (since < HOLD + SLIDE) {
    track(g, OLD, 3, 3, UI.gold, ease((since - HOLD) / SLIDE) * FAR, true)
    title(g, since)
  } else track(g, NEW, 0, 1, UI.text, (1 - ease((since - HOLD - SLIDE) / SLIDE)) * FAR)
  for (let i = 0; i < GOT; i++) {
    const u = (since - WAIT - i * GAP) / FLY, e = u * u * (3 - 2 * u)
    if (u > 0 && u < 1) orb(g, Math.round(from[0] + (16 - from[0]) * e), Math.round(from[1] + (15 - from[1]) * e - Math.sin(Math.PI * u) * 12), LESS, true)
  }
  live.show()
}

;([['2', 'Orb as you saw it', SHOWN], ['3', 'Orb 10% less red', LESS]] as const).forEach(([n, name, cols]) => {
  const v = view(`<b>${n}</b>${name}`, 400, 100, 240), s = v.low, big = ctx(mk(5, 7)), paint = () => {
    s.drawImage(art, -240, 0)
    amount(s, cols, '128', 25 + width('128'), 19, true)
    text(s, '+1', 120, 44, cols['#'], 'c', UI.panel)
    s.fillStyle = UI.night
    s.fillRect(0, 64, 400, 36)
    frame(s, 8, 73, 184, 17, false)
    text(s, 'Sharp Mandibles', 15, 85, UI.text)
    amount(s, cols, '5', 185, 85)
    amount(s, cols, '128', 392, 91, false, 2)
    big.clearRect(0, 0, 5, 7)
    orb(big, 2, 3, cols)
    s.imageSmoothingEnabled = false
    s.drawImage(big.canvas, 234, 64, 20, 28)
    v.show()
  }
  paint()
  setTimeout(paint, 500)
})

let last = 0
function loop(now: number) {
  requestAnimationFrame(loop)
  step(Math.min(.05, (now - last) / 1000))
  last = now
}
requestAnimationFrame(loop)
