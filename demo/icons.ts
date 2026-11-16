import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { W } from '../data/look/screen'
import { icon } from '../ui/parts/icons'
import { text } from '../ui/text/text'
import { ground } from '../world/stage1/scenery/ground'

type Draw = (lo: Ctx, hi: Ctx, x: number, y: number, col: string) => void
type Part = [draw: (g: Ctx) => void, line?: number]

const TAU = Math.PI * 2, WIDE = 250, TALL = 26, LEFT = W - WIDE, Y = 5, main = document.querySelector('main')!
const SLIDERS = ['......###', '###########', '......###', '', '..###', '###########', '..###', '', '.....###', '###########', '.....###']
const THIN = Array.from({ length: 11 }, (_, i) => '.'.repeat(i) + '#')
const LOUD = ['....#', '...##...#', '#####....#', '#####.#..#', '#####.#..#', '#####.#..#', '#####....#', '...##...#', '....#']
const QUIET = ['....#', '...##', '#####.#...#', '#####..#.#', '#####...#', '#####..#.#', '#####.#...#', '...##', '....#']

function ink(g: Ctx, col: string, parts: Part[]) {
  g.lineCap = g.lineJoin = 'round'
  for (const [c, more] of [[UI.panel, 2], [col, 0]] as const) for (const [draw, line = 0] of parts) {
    g.beginPath()
    draw(g)
    g.strokeStyle = g.fillStyle = c
    g.lineWidth = line + more
    if (line || more) g.stroke()
    if (!line) g.fill('evenodd')
  }
}

function art(g: Ctx, rows: string[], x: number, y: number, col: string) {
  for (let n = 0; n < 10; n++) {
    g.fillStyle = n < 9 ? UI.panel : col
    rows.forEach((row, j) => [...row].forEach((ch, i) => ch === '#' && g.fillRect(x + i + (n < 9 ? n % 3 - 1 : 0), y + j + (n < 9 ? (n / 3 | 0) - 1 : 0), 1, 1)))
  }
}

const line = (x0: number, y0: number, x1: number, y1: number, wide: number): Part => [g => {
  g.moveTo(x0, y0)
  g.lineTo(x1, y1)
}, wide]
const round = (x: number, y: number, rx: number, ry = rx, lean = 0): Part => [g => g.ellipse(x, y, rx, ry, lean, 0, TAU)]

const cog = (n: number, R: number, r: number, hole: number, base: number, tip: number): Draw => (_lo, hi, x, y, col) => ink(hi, col, [[g => {
  for (let i = 0; i < n; i++) for (const [rad, off] of [[r, -base], [R, -tip], [R, tip], [r, base]])
    g.lineTo(x + 8.5 + Math.cos(i * TAU / n + off) * rad, y + 8.5 + Math.sin(i * TAU / n + off) * rad)
  g.closePath()
  g.moveTo(x + 8.5 + hole, y + 8.5)
  g.arc(x + 8.5, y + 8.5, hole, 0, TAU)
}]])
const sliders: Draw = (_lo, hi, x, y, col) => ink(hi, col, [
  ...[0, 1, 2].map(i => line(x + 3.5, y + 4.8 + i * 3.7, x + 13.5, y + 4.8 + i * 3.7, 1.3)),
  ...[2.2, -2.4, .8].map((dx, i) => round(x + 8.5 + dx, y + 4.8 + i * 3.7, 1.7)),
])
const pixel = (rows: string[], dx: number, dy: number): Draw => (lo, _hi, x, y, col) => art(lo, rows, x + dx, y + dy, col)
const old = (name: 'note' | 'pause' | 'gear' | 'slash', pad = 4): Draw => (lo, _hi, x, y, col) => icon(lo, name, x + pad, y + pad, col, UI.panel)

const single: Draw = (_lo, hi, x, y, col) => ink(hi, col, [
  round(x + 6.9, y + 11.8, 2.3, 1.75, -.35),
  line(x + 8.95, y + 11.4, x + 8.95, y + 3.7, 1.25),
  [g => {
    g.moveTo(x + 8.95, y + 3.7)
    g.bezierCurveTo(x + 9.8, y + 5.6, x + 12.6, y + 5.4, x + 12, y + 8.2)
  }, 1.25],
])
const double: Draw = (_lo, hi, x, y, col) => ink(hi, col, [
  round(x + 5.3, y + 12.1, 1.9, 1.45, -.35),
  round(x + 11.1, y + 10.9, 1.9, 1.45, -.35),
  line(x + 7.05, y + 11.8, x + 7.05, y + 4.9, 1.2),
  line(x + 12.85, y + 10.6, x + 12.85, y + 3.7, 1.2),
  line(x + 7.05, y + 4.9, x + 12.85, y + 3.7, 1.9),
])
const cross: Draw = (_lo, hi, x, y, col) => ink(hi, col, [line(x + 3.3, y + 3.3, x + 13.7, y + 13.7, 1.4)])
const horn = (x: number, y: number): Part => [g => {
  for (const [dx, dy] of [[-5.2, -1.7], [-3.3, -1.7], [-.6, -4.3], [-.6, 4.3], [-3.3, 1.7], [-5.2, 1.7]]) g.lineTo(x + 8.5 + dx, y + 8.5 + dy)
  g.closePath()
}]
const loud: Draw = (_lo, hi, x, y, col) => ink(hi, col, [horn(x, y), ...[2.5, 4.7].map(r => [(g: Ctx) => g.arc(x + 7.9, y + 8.5, r, -.8, .8), 1.2] as Part)])
const quiet: Draw = (_lo, hi, x, y, col) => ink(hi, col, [horn(x, y), line(x + 10.2, y + 6.5, x + 14.2, y + 10.5, 1.3), line(x + 14.2, y + 6.5, x + 10.2, y + 10.5, 1.3)])
const both = (...list: Draw[]): Draw => (lo, hi, x, y, col) => list.forEach(d => d(lo, hi, x, y, col))
const tint = (d: Draw, to: string): Draw => (lo, hi, x, y) => d(lo, hi, x, y, to)

const note = old('note'), pause = old('pause')
const GEARS: [string, Draw][] = [
  ['Cog', cog(8, 5.4, 3.9, 1.8, .27, .16)],
  ['Bold cog', cog(6, 5.6, 3.9, 1.7, .38, .25)],
  ['Hex nut', cog(6, 5.5, 5.5, 2.3, TAU / 12, TAU / 12)],
  ['Sliders', sliders],
  ['Pixel sliders', pixel(SLIDERS, 3, 3)],
]
const MUTES: [string, Draw, Draw][] = [
  ['Thin slash', note, both(note, pixel(THIN, 3, 3))],
  ['Red slash', note, both(note, tint(pixel(THIN, 3, 3), UI.foe))],
  ['Smooth note', single, both(single, cross)],
  ['Double note', double, both(double, cross)],
  ['Dim with x', note, both(tint(note, UI.dim), pixel(['#...#', '.#.#', '..#', '.#.#', '#...#'], 10, 10))],
  ['Speaker', loud, quiet],
  ['Pixel speaker', pixel(LOUD, 3, 4), pixel(QUIET, 3, 4)],
]

function card(tag: string, name: string, slots: [number, Draw][], words: [string, number][] = []) {
  const box = main.appendChild(document.createElement('div')), lo = ctx(box.appendChild(mk(WIDE, TALL))), top = box.appendChild(mk(1, 1)), hi = ctx(top)
  return (zoom: number, k: number) => {
    lo.canvas.style.width = WIDE * zoom + 'px'
    top.width = WIDE * k
    top.height = TALL * k
    lo.setTransform(1, 0, 0, 1, -LEFT, 0)
    lo.drawImage(ground(), 0, 0)
    hi.setTransform(k, 0, 0, k, -LEFT * k, 0)
    text(lo, tag, LEFT + 6, 21, UI.text, undefined, UI.panel, tag.length > 2 ? 1 : 2)
    text(lo, name, LEFT + 30, 17, UI.text, undefined, UI.panel)
    for (const [say, right] of words) text(lo, say, right, 17, UI.dim, 'r', UI.panel)
    for (const [x, draw] of slots) draw(lo, hi, x, Y, UI.text)
  }
}

function head(say: string) {
  main.appendChild(document.createElement('h2')).textContent = say
}

const row = (gear: Draw): [number, Draw][] => [[W - 67, note], [W - 46, pause], [W - 25, gear]]
const pair = (on: Draw, off: Draw): [number, Draw][] => [[W - 126, on], [W - 105, pause], [W - 46, off], [W - 25, pause]]
const WORDS: [string, number][] = [['On', W - 130], ['Muted', W - 50]]

head('Settings icon')
const cards = [card('Now', '', row(old('gear', 3))), ...GEARS.map(([name, gear], i) => card(String(i + 1), name, row(gear)))]
head('Music icon, on and muted')
cards.push(card('Now', '', pair(note, both(tint(note, UI.dim), old('slash'))), WORDS))
cards.push(...MUTES.map(([name, on, off], i) => card(String(GEARS.length + i + 1), name, pair(on, off), WORDS)))

function fit() {
  const zoom = Math.max(2, Math.min(3, Math.floor((innerWidth - 24) / WIDE)))
  cards.forEach(paint => paint(zoom, zoom * (devicePixelRatio || 1)))
}

addEventListener('resize', fit)
fit()
