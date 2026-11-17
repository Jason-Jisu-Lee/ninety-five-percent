import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { PERCHES } from '../data/stage1/map'
import { spot } from '../ui/parts/marks'
import { ring } from '../ui/parts/ring'
import { ground } from '../world/stage1/scenery/ground'

type Look = (g: Ctx, x: number, y: number) => void

const BRIGHT = '#c8f4f1', GOLD = '#f0d98a', CROPS = [[513, 252, 110, 66], [45, 286, 110, 66]], HOT = [568, 100].map(x => PERCHES.find(p => p.x === x)!)
const main = document.querySelector('main')!

function glow(g: Ctx, x: number, y: number, col: string) {
  g.globalAlpha = .22
  g.fillStyle = col
  for (let j = -5; j <= 5; j++) {
    const w = Math.round(Math.sqrt(1 - (j / 6.3) ** 2) * 6)
    g.fillRect(x - w, y + j, w * 2 + 1, 1)
  }
  g.globalAlpha = 1
}

const LOOKS: [string, string, Look][] = [
  ['1 Now', 'For comparison: the ring in the same blue as the small marks', (g, x, y) => ring(g, x, y, 7, UI.ally)],
  ['2 Brighter blue', 'Same ring, a lighter and stronger blue', (g, x, y) => ring(g, x, y, 7, BRIGHT)],
  ['3 Pale gold', 'Same ring, a warm pale gold', (g, x, y) => ring(g, x, y, 7, GOLD)],
  ['4 Brighter blue with a soft glow', 'Brighter ring, and the inside is faintly lit', (g, x, y) => {
    glow(g, x, y, BRIGHT)
    ring(g, x, y, 7, BRIGHT)
  }],
  ['5 Pale gold with a soft glow', 'Gold ring, and the inside is faintly lit', (g, x, y) => {
    glow(g, x, y, GOLD)
    ring(g, x, y, 7, GOLD)
  }],
  ['6 Blue ring, bright centre', 'The ring stays as now, and the small marks stay inside it in near white', (g, x, y) => {
    ring(g, x, y, 7, UI.ally)
    spot(g, x, y, '#f4fffe')
  }],
]

const full = mk(W, H), fg = ctx(full)
const cards = LOOKS.map(([name, about, look]) => {
  const card = main.appendChild(document.createElement('section'))
  card.innerHTML = `<b>${name}</b><small>${about}</small><small>Left: a rock spot hovered. Right: a lily pad hovered. The other spots are not hovered</small>`
  const row = card.appendChild(document.createElement('div'))
  fg.drawImage(ground(), 0, 0)
  for (const r of PERCHES) {
    const y = Math.round(r.y - r.h * .7)
    if (HOT.includes(r)) look(fg, r.x, y)
    else spot(fg, r.x, y, UI.ally)
  }
  return CROPS.map(([x, y, w, h]) => {
    const c = row.appendChild(mk(w, h))
    ctx(c).drawImage(full, x, y, w, h, 0, 0, w, h)
    return c
  })
})

function fit() {
  const wide = Math.min(W * 3, innerWidth - 48)
  cards.flat().forEach(c => c.style.width = (wide - 12) / 2 + 'px')
}

addEventListener('resize', fit)
fit()
