import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { COLOR, WING } from '../data/dragonfly/colors'
import { FOREST as C, UI } from '../data/look/palette'
import { text } from '../ui/text/text'
import { wear } from '../world/dragonfly/sprite/sheet'
import { ground } from '../world/stage1/scenery/ground'

type Dot = (a: number, c: number, col: string) => void
type Paint = string | ((a: number, c: number) => string)
type Bug = (dot: Dot, f: number, t: number) => void

const INK = '#181e1e', CW = 96, CH = 50, main = document.querySelector('main')!

function pen(g: Ctx, x: number, y: number, ang: number, shade = false): Dot {
  const co = Math.cos(ang), si = Math.sin(ang)
  return (a, c, col) => {
    g.fillStyle = shade ? C.deep : col
    g.fillRect(Math.round(x + co * a - si * c), Math.round(y + si * a + co * c), 1, 1)
  }
}

function oval(dot: Dot, a0: number, c0: number, ra: number, rc: number, col: Paint) {
  for (let a = -ra; a <= ra; a += .5) for (let c = -rc; c <= rc; c += .5)
    if ((a / Math.max(.4, ra)) ** 2 + (c / Math.max(.4, rc)) ** 2 <= 1) dot(a0 + a, c0 + c, typeof col === 'string' ? col : col(a0 + a, c0 + c))
}

function line(dot: Dot, a0: number, c0: number, a1: number, c1: number, col: string) {
  const n = Math.ceil(Math.hypot(a1 - a0, c1 - c0) * 2)
  for (let i = 0; i <= n; i++) dot(a0 + (a1 - a0) * i / n, c0 + (c1 - c0) * i / n, col)
}

const pair = (draw: (s: number) => void) => [-1, 1].forEach(draw)
const bands = (one: string, two: string, wide = 1.4) => (a: number) => Math.floor((a + 20) / wide) & 1 ? one : two

const BUGS: [string, string, string, Bug][] = [
  ['1 Mayfly', 'Pale yellow, tall clear wings, two long tail threads', 'Weak and slow. Drifts up and down over the water', (dot, f) => {
    pair(s => line(dot, -3, s * .3, -9, s * 2.2, '#f1ecc4'))
    pair(s => oval(dot, 1.2, s * (1 + 3 * f), 1.7, 3 * f, WING.fill))
    oval(dot, 0, 0, 3.5, .8, '#e8dc8a')
    dot(3.5, 0, INK)
  }],
  ['2 Ladybird', 'Round red dome with black spots', 'Slow and tough. Crawls on leaves, flies off in a straight line', (dot, f) => {
    if (f > .35) pair(s => oval(dot, -1, s * (2 + 2.5 * f), 1.6, 2.5 * f, WING.fill))
    oval(dot, 0, 0, 2.6, 2.4, C.red)
    oval(dot, 2.4, 0, .8, 1.5, INK)
    line(dot, -2.5, 0, 1.6, 0, INK)
    pair(s => [[.6, 1.3], [-1.2, 1]].forEach(([a, c]) => dot(a, s * c, INK)))
  }],
  ['3 Bumblebee', 'Fat and furry, yellow and black bands, white tail', 'Fights back with a sting. Slow, visits flowers', (dot, f) => {
    pair(s => oval(dot, .8, s * (2 + 2 * f), 1.3, 2 * f, WING.fill))
    oval(dot, 0, 0, 3.6, 2.3, a => a < -2.6 ? C.white : bands(INK, C.yellow, 1.5)(a))
    oval(dot, 3.4, 0, .8, 1.3, INK)
  }],
  ['4 Wasp', 'Narrow waist, sharp yellow stripes, amber wings swept back', 'Fights back hard. Fast and aggressive', (dot, f) => {
    pair(s => line(dot, 1.5, s, -2.5, s * (1.5 + 4.5 * f), C.husk))
    pair(s => line(dot, 1, s, -3, s * (1 + 4 * f), C.husk))
    oval(dot, -3, 0, 2.8, 1.4, bands(C.yellow, INK, 1.2))
    dot(-.2, 0, INK)
    oval(dot, 1.5, 0, 1.4, 1.3, INK)
    oval(dot, 3.6, 0, .9, 1.2, C.yellow)
    dot(-6, 0, INK)
  }],
  ['5 Crane fly', 'Thin body, very long spindly legs, narrow wings held straight out', 'Clumsy and slow. Bobs around low over the grass', (dot, f) => {
    pair(s => [[2, 5, 7], [0, -1, 9], [-1, -6, 7]].forEach(([a, b, c]) => line(dot, a, s * .5, b, s * c, C.t1)))
    pair(s => line(dot, 1.5, s, .5, s * (1 + 6 * f), WING.fill))
    pair(s => line(dot, 1, s, -.2, s * (1 + 5 * f), WING.fill))
    line(dot, -4, 0, 3, 0, C.t0)
    dot(3.5, 0, INK)
  }],
  ['6 Damselfly', 'A needle-thin blue body, like a small dragonfly', 'Quick and nimble. Hard to hold on to', (dot, f) => {
    pair(s => line(dot, 3.5, s, 1, s * (1 + 6 * f), WING.fill))
    pair(s => line(dot, 3, s, -.5, s * (1 + 5.5 * f), WING.fill))
    line(dot, -7, 0, 4, 0, '#4fc3e8')
    for (const a of [-5, -3, -1]) dot(a, 0, INK)
    oval(dot, 4, 0, 1, .8, '#4fc3e8')
    pair(s => dot(5.2, s * 1.2, INK))
  }],
  ['7 Lacewing', 'Bright green body under big pale green wings, long feelers', 'Flutters weakly. Easy once reached', (dot, f) => {
    pair(s => line(dot, 3, s * .3, 6.5, s * 2.2, C.g3))
    pair(s => oval(dot, -1, s * (.8 + 2.6 * f), 4, 2.6 * f, (a, c) => (Math.round(a * 2) + Math.round(c * 2)) % 3 ? '#c9efb8' : '#8fd07a'))
    line(dot, -3, 0, 3, 0, '#58b84a')
    pair(s => dot(3.2, s * .8, C.husk))
  }],
  ['8 Firefly', 'Dark body, orange head, a tail that pulses yellow-green', 'Blinks. Only easy to see when it glows', (dot, f, t) => {
    const lit = Math.sin(t * 3) > -.2
    pair(s => oval(dot, 0, s * (1.5 + 2 * f), 1.3, 2 * f, WING.fill))
    oval(dot, 0, 0, 3, 1.4, INK)
    oval(dot, 2.6, 0, .9, 1.3, '#e8843a')
    oval(dot, -3, 0, lit ? 1.8 : 1, lit ? 1.8 : 1, lit ? '#e6ff7a' : '#8a9a3a')
  }],
  ['9 White butterfly', 'Wide white wings with dark tips', 'Tumbles about unpredictably. Slow but hard to line up', (dot, f) => {
    pair(s => oval(dot, 1.6, s * (.6 + 4 * f), 2.8, 4 * f, (a, c) => a > 2.6 && Math.abs(c) > 4.5 * f ? INK : C.white))
    pair(s => oval(dot, -2, s * (.6 + 3 * f), 2.2, 3 * f, '#e2dcc6'))
    line(dot, -3, 0, 3, 0, INK)
  }],
  ['10 June beetle', 'Chunky glossy brown shell, amber wings when it flies', 'Armoured and heavy. Takes many bites', (dot, f) => {
    if (f > .35) pair(s => oval(dot, -1, s * (2.5 + 3.5 * f), 2, 3.5 * f, C.husk))
    oval(dot, -.5, 0, 4, 3, C.t0)
    line(dot, -4, 0, 2, 0, C.t1)
    oval(dot, 3.6, 0, 1.2, 1.8, C.t2)
    pair(s => line(dot, -2, s * 1.6, 1, s * 1.6, '#a5774e'))
  }],
]

const patch = mk(CW, CH), pg = ctx(patch), fly = wear(COLOR, [0, 0])(2, 0)
const cards = BUGS.map(([name, look, act]) => {
  const card = main.appendChild(document.createElement('section'))
  card.innerHTML = `<b>${name}</b><small>${look}</small><small>${act}</small>`
  return card.appendChild(mk(CW, CH))
})
const all = main.insertBefore(document.createElement('section'), main.firstChild)
all.innerHTML = '<b>All ten at game size</b><small>Next to the dragonfly, with the number of each above it. Details are below</small>'
const row = all.appendChild(mk(320, 70))

function scene(g: Ctx, sx: number, sy: number, w: number, h: number) {
  g.drawImage(ground(), sx, sy, w, h, 0, 0, w, h)
}

function show(g: Ctx, bug: Bug, x: number, y: number, ang: number, f: number, t: number) {
  if (f > .35) bug(pen(g, x + 5, y + 9, ang, true), f, t)
  bug(pen(g, x, y, ang), f, t)
}

function draw(ms: number) {
  const t = ms / 1000, f = t * 9 % 1 < .5 ? 1 : .5
  const rg = ctx(row)
  scene(rg, 300, 130, 320, 70)
  rg.drawImage(fly[1], 20, 28)
  rg.drawImage(fly[0], 14, 16)
  BUGS.forEach(([name, , , bug], i) => {
    const x = 70 + i * 25, y = 36 + (i & 1) * 10
    show(rg, bug, x, y, -.5, f, t)
    text(rg, name.split(' ')[0], x, y - 12, UI.text, 'c', UI.panel)
  })
  BUGS.forEach(([, , , bug], i) => {
    scene(pg, 380 + i * 7, 150, CW, CH)
    pg.drawImage(fly[1], 8, 16)
    pg.drawImage(fly[0], 2, 4)
    show(pg, bug, 58, 18, -.5, f, t)
    show(pg, bug, 80, 38, .9, .3, t)
    ctx(cards[i]).drawImage(patch, 0, 0)
  })
  requestAnimationFrame(draw)
}

function fit() {
  const wide = Math.min(1100, innerWidth - 48)
  row.style.width = wide + 'px'
  cards.forEach(c => c.style.width = Math.min(wide, 672) + 'px')
}

addEventListener('resize', fit)
fit()
requestAnimationFrame(draw)
