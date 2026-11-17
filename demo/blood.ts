import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { FOREST as C, UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { drop } from '../ui/parts/icons'
import { box } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { ground } from '../world/stage1/scenery/ground'

type Look = (g: Ctx, n: string) => void

const CROP = [0, 0, 120, 44], main = document.querySelector('main')!

function bead(g: Ctx, x: number, y: number) {
  for (let i = 0; i < 9; i++) drop(g, x + i % 3 - 1, y + (i / 3 | 0) - 1, UI.panel)
  drop(g, x, y, C.red)
}

function glass(g: Ctx, n: string, alpha: number) {
  g.globalAlpha = alpha
  g.fillStyle = UI.panel
  g.fillRect(9, 8, width(n) + 22, 15)
  for (const x of [8, width(n) + 31]) g.fillRect(x, 9, 1, 13)
  g.globalAlpha = 1
  drop(g, 16, 15, C.red)
  text(g, n, 24, 19, UI.text)
}

const LOOKS: [string, string, Look][] = [
  ['1 Now', 'For comparison: the black box with a pale border', (g, n) => {
    box(g, 8, 8, 54, 15, UI.border, UI.panel)
    drop(g, 16, 15, C.red)
    text(g, n, 24, 19, UI.text)
  }],
  ['2 No box', 'Only the drop and the number, with a thin dark outline so they read on any ground', (g, n) => {
    bead(g, 16, 15)
    text(g, n, 24, 19, UI.text, undefined, UI.panel)
  }],
  ['3 Smoke glass', 'See-through dark patch, no border, sized to the number. Same family as the warning box', (g, n) => glass(g, n, .5)],
  ['4 Faint glass', 'The same patch, much fainter', (g, n) => glass(g, n, .28)],
  ['5 No box, big number', 'The number at double size with a dark outline', (g, n) => {
    bead(g, 15, 17)
    text(g, n, 23, 24, UI.text, undefined, UI.panel, 2)
  }],
  ['6 No box, red number', 'Like 2, with the number in blood red', (g, n) => {
    bead(g, 16, 15)
    text(g, n, 24, 19, '#f06a50', undefined, UI.panel)
  }],
]

const full = mk(W, H), fg = ctx(full)
const cards = LOOKS.map(([name, about, look]) => {
  const card = main.appendChild(document.createElement('section'))
  card.innerHTML = `<b>${name}</b><small>${about}</small><small>Left: 27 blood. Right: 12480 blood</small>`
  const row = card.appendChild(document.createElement('div'))
  return ['27', '12480'].map(n => {
    fg.drawImage(ground(), 0, 0)
    look(fg, n)
    const c = row.appendChild(mk(CROP[2], CROP[3]))
    ctx(c).drawImage(full, CROP[0], CROP[1], CROP[2], CROP[3], 0, 0, CROP[2], CROP[3])
    return c
  })
})

function fit() {
  const wide = Math.min(W * 3, innerWidth - 48)
  cards.flat().forEach(c => c.style.width = (wide - 12) / 2 + 'px')
}

addEventListener('resize', fit)
fit()
