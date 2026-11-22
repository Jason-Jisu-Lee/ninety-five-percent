import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { PREY, type Kind } from '../data/enemies/enemies'
import { UI } from '../data/look/palette'
import { tone } from '../ui/enemy/tone'
import { marks } from '../ui/parts/marks'
import { box } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { drawPrey } from '../world/creatures/draw'
import type { Prey } from '../world/creatures/prey'
import { place } from '../world/place/place'

type Cap = (g: Ctx, x: number, y: number, w: number) => number

const X0 = 12, Y0 = 244, CW = 156, CH = 100, K = 3
const SHOWN: [Kind, number, number][] = [['moth', 58, 300], ['bumblebee', 108, 328]]
const CAPS: [string, Cap][] = [
  ['Joined to the name box', (g, x, y, w) => {
    box(g, x + w - 1, y, 14, 19, UI.border, UI.panel)
    text(g, 'A', x + w + 4, y + 13, UI.text)
    return 0
  }],
  ['A key beside the box', (g, x, y, w) => {
    box(g, x + w + 2, y + 3, 11, 13, UI.dim, UI.dim)
    box(g, x + w + 2, y + 3, 11, 11, UI.border, UI.border)
    text(g, 'A', x + w + 5, y + 12, UI.panel)
    return 0
  }],
  ['Inside the box, after the name', (g, x, y, w) => {
    box(g, x + w, y + 2, 11, 11, UI.dim, UI.panel)
    text(g, 'A', x + w + 3, y + 11, UI.text)
    return 15
  }],
]

function tag(g: Ctx, p: Prey, cap: Cap) {
  const k = PREY[p.kind], w = Math.max(width(k.name), 22) + 10, x = Math.round(p.x - w / 2), py = Math.round(p.y - p.h * .7), reach = Math.ceil(Math.max(k.len, k.wing * 2 + k.wide) / 2) + 3, y = py - reach - 23
  const more = cap(ctx(mk(1, 1)), 0, 0, 0)
  marks(g, Math.round(p.x), py, reach, UI.foe)
  box(g, x, y, w + more, 19, UI.border, UI.panel)
  text(g, k.name, x + w / 2, y + 11, tone(p.kind), 'c')
  g.fillStyle = UI.line
  g.fillRect(x + 4, y + 14, w + more - 8, 2)
  g.fillStyle = UI.foe
  g.fillRect(x + 4, y + 14, w + more - 8, 2)
  cap(g, x, y, w)
}

CAPS.forEach(([name, cap], n) => {
  const fig = document.querySelector('main')!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(CW * K, CH * K)), g = ctx(c)
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${name}</figcaption>`)
  g.imageSmoothingEnabled = false
  g.setTransform(K, 0, 0, K, -X0 * K, -Y0 * K)
  g.drawImage(place().art, 0, 0)
  const prey = SHOWN.map(([kind, x, y]) => ({ kind, x, y, h: PREY[kind].h, ang: -.6, hp: PREY[kind].hp, wings: true, flash: 0, seed: .3 } as Prey))
  for (const p of prey) drawPrey(g, p, 0, true)
  for (const p of prey) drawPrey(g, p, 0)
  for (const p of prey) tag(g, p, cap)
})
