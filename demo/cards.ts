import { save } from '../core/save/save'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { COLORS } from '../data/dragonfly/colors'
import { CM, FLY, STAMINA } from '../data/dragonfly/flight'
import { STAT } from '../data/dragonfly/stats'
import { PREY, type Kind } from '../data/enemies/enemies'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { tone } from '../ui/enemy/tone'
import { traits } from '../ui/enemy/traits'
import { icon } from '../ui/parts/icons'
import { box, panel } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { wrap } from '../ui/text/wrap'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'

type Row = [string, string, string?]
type Card = { name: string; col: string; about: string[]; rows: Row[]; skills: [string, string][] }
type Way = { name: string; note: string; pw: number; two: boolean; dim: boolean; rule: boolean }

const K = 2, IN = 12, SEE = .84, num = (v: number) => String(+v.toFixed(2))
const WAYS: Way[] = [
  { name: 'Two columns', note: 'The enemy card as it is now, used for both: 256 wide, stats in two columns with grey names', pw: 256, two: true, dim: true, rule: false },
  { name: 'One column', note: 'The dragonfly card as it is now, used for both: 200 wide, one stat per row with white names', pw: 200, two: false, dim: false, rule: false },
  { name: 'One column with lines', note: 'Like 2, with thin lines between the name, the stats and the abilities', pw: 200, two: false, dim: false, rule: true },
]
const KINDS: Kind[] = ['fruitfly', 'wasp', 'moth']
const SKILLS: [string, string][] = [
  ['Lunge', 'Once locked, press S at the right time to lunge. That bite does 2 times the damage'],
  ['Ambush', 'A bite while the enemy has its back turned does double damage'],
]

const foe = (kind: Kind): Card => {
  const k = PREY[kind]
  return {
    name: k.name, col: tone(kind), about: [k.text], skills: traits(k) as [string, string][],
    rows: [['Health', num(k.hp)], ['Lifeblood', num(k.blood)], ['Power', num(k.power)], ['Speed', num(k.speed)]],
  }
}
const me = (): Card => ({
  name: 'Dragonfly', col: COLORS[save.color][0], about: ['Agile predatory insect'], skills: SKILLS,
  rows: [
    ['Power', num(STAT.power), 'Damage per attack'], ['Health', num(STAT.health), 'Hit points'], ['Armor', num(STAT.armor), 'Damage blocked per attack'],
    ['Speed', num(FLY.top * STAT.speed / CM) + ' cm/s', 'Flying speed'], ['Turning', num(75 * STAT.turn * STAT.speed) + ' deg/s', 'How fast it turns'],
    ['Stamina', num(100 / STAMINA.drain * STAT.stamina) + ' s', 'How long it can fly'], ['Rest', num(STAMINA.regen * STAT.rest) + '%/s', 'Stamina regained per second of rest'],
    ['Mend in flight', num(STAT.mend) + '%/s', 'Health regained per second of flight'],
  ],
})

function tip(g: Ctx, lines: string[], x: number, y: number) {
  const w = Math.max(...lines.map(l => width(l))) + 10, h = lines.length * 11 + 7, left = Math.min(x, W - w - 2)
  box(g, left, y, w, h, UI.border, UI.panel)
  lines.forEach((l, i) => text(g, l, left + 5, y + 12 + i * 11, UI.text))
}

function card(g: Ctx, c: Card, way: Way, x: number, mx: number, my: number) {
  const { pw } = way, about = c.about.flatMap(a => wrap(a, pw - IN * 2)), per = way.two ? 2 : 1, rows = Math.ceil(c.rows.length / per)
  const words: [string, string, number, number][] = []
  let wx = 0, wy = 0
  for (const [n, say] of c.skills) {
    if (wx && wx + width(n) > pw - IN * 2) [wx, wy] = [0, wy + 12]
    words.push([n, say, wx, wy])
    wx += width(n) + 12
  }
  const gap = way.rule ? 8 : 0, tall = 44 + about.length * 11 + 6 + gap + rows * 12 + (words.length ? 8 + gap + wy + 12 : 0) + 4, top = H - tall >> 1
  g.globalAlpha = SEE
  panel(g, x, top, pw, tall, UI.border, UI.panel)
  g.globalAlpha = 1
  box(g, x + pw - 19, top + 6, 11, 11, UI.border, UI.panel)
  icon(g, 'x', x + pw - 16, top + 9, UI.text)
  text(g, c.name, x + IN, top + 24, c.col, undefined, undefined, 2)
  let y = top + 43
  for (const line of about) text(g, line, x + IN, (y += 11) - 11, UI.text)
  y += 6
  const rule = () => {
    if (!way.rule) return
    g.fillStyle = UI.line
    g.fillRect(x + IN, y - 6, pw - IN * 2, 1)
    y += gap
  }
  rule()
  let over = ''
  c.rows.forEach(([n, v, say], i) => {
    const fx = x + IN + (way.two ? (i & 1) * 120 : 0), fy = y + (way.two ? i >> 1 : i) * 12, right = way.two ? fx + 104 : x + pw - IN
    const hot = !!say && mx >= fx && mx < right && my >= fy - 9 && my < fy + 3
    if (hot) over = say
    text(g, n, fx, fy, hot ? UI.accent : way.dim ? UI.dim : UI.text)
    text(g, v, right, fy, UI.text, 'r')
  })
  y += rows * 12 + 2
  let hover: [string[], number, number] | null = over ? [[over], mx + 6, my + 8] : null
  if (words.length) {
    y += 6
    rule()
    for (const [n, say, ox, oy] of words) {
      const wx = x + IN + ox, wy = y + oy, hot = mx >= wx - 2 && mx < wx + width(n) + 2 && my >= wy - 9 && my < wy + 3
      text(g, n, wx, wy, hot ? UI.text : UI.gold)
      if (hot) hover = [wrap(say, 150), wx - 5, wy + 6]
    }
  }
  if (hover) tip(g, ...hover)
}

const host = document.querySelector('section')!, bg = ctx(mk(W, H)), sim = hunt()
for (let t = 0; t < 6; t += 1 / 60) sim.prey.step(1 / 60, t, -999, -999, null)
const views = WAYS.map((way, n) => {
  const fig = host.appendChild(document.createElement('figure')), c = fig.appendChild(mk(W * K, H * K)), out = ctx(c), low = ctx(mk(W, H))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${way.name}<i>${way.note}</i></figcaption>`)
  let mx = -1, my = -1, pick = 0
  c.onmousemove = e => [mx, my] = [e.offsetX / c.clientWidth * W, e.offsetY / c.clientHeight * H]
  c.onmouseleave = () => [mx, my] = [-1, -1]
  c.onclick = () => pick = (pick + 1) % KINDS.length
  return () => {
    low.drawImage(bg.canvas, 0, 0)
    card(low, foe(KINDS[pick]), way, way.two ? 48 : 90, mx, my)
    card(low, me(), way, W - (way.two ? 48 : 90) - way.pw, mx, my)
    out.imageSmoothingEnabled = false
    out.drawImage(low.canvas, 0, 0, W * K, H * K)
  }
})
render(bg, sim, 6, true, null, false)
const loop = () => {
  views.forEach(v => v())
  requestAnimationFrame(loop)
}
loop()
