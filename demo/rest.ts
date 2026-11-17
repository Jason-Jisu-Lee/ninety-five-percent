import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { COLOR } from '../data/dragonfly/colors'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { PERCHES } from '../data/stage1/map'
import { marks, spot } from '../ui/parts/marks'
import { ring } from '../ui/parts/ring'
import { wear } from '../world/dragonfly/sprite/sheet'
import { ground } from '../world/stage1/scenery/ground'

type Look = (g: Ctx, x: number, y: number, hot: boolean, t: number, i: number) => void

const BRIGHT = '#dffaf8', CROPS = [[513, 252, 110, 66], [45, 286, 110, 66]], HOT = [568, 100].map(x => PERCHES.find(p => p.x === x)!)
const main = document.querySelector('main')!

const px = (g: Ctx, col: string, x: number, y: number, w = 1, h = 1) => {
  g.fillStyle = col
  g.fillRect(x, y, w, h)
}

function pool(g: Ctx, x: number, y: number, rx: number, ry: number, alpha: number) {
  g.globalAlpha = alpha
  for (let j = -ry; j <= ry; j++) {
    const w = Math.round(Math.sqrt(1 - (j / (ry + .5)) ** 2) * rx)
    px(g, BRIGHT, x - w, y + j, w * 2 + 1)
  }
  g.globalAlpha = 1
}

const LOOKS: [string, string, Look][] = [
  ['1 Now', 'For comparison: a tiny blue ring, and a wider ring when hovered', (g, x, y, hot) => hot ? ring(g, x, y, 7, UI.ally) : spot(g, x, y, UI.ally)],
  ['2 Corner marks', 'Small corner marks like the ones around the dragonfly. Hovered: they open wider and turn bright', (g, x, y, hot) => marks(g, x, y, hot ? 6 : 3, hot ? BRIGHT : UI.ally, hot ? 3 : 2)],
  ['3 Landing arrow', 'A small arrow floats above the spot and bobs. Hovered: it turns bright and a line marks the landing point', (g, x, y, hot, t, i) => {
    const top = y - 9 + Math.round(Math.sin(t * 3 + i) * 1), col = hot ? BRIGHT : UI.ally
    for (let j = 0; j < 3; j++) px(g, col, x - 2 + j, top + j, 5 - j * 2)
    if (hot) px(g, col, x - 3, y, 7)
  }],
  ['4 Twinkle', 'One pixel that glints now and then, each spot at its own time. Hovered: a steady bright star', (g, x, y, hot, t, i) => {
    const on = hot || (t * .6 + i * .37) % 1 < .18
    px(g, hot ? BRIGHT : UI.ally, x, y)
    if (on) for (const d of hot ? [1, 2] : [1]) for (const [a, b] of [[d, 0], [-d, 0], [0, d], [0, -d]]) px(g, hot ? BRIGHT : UI.ally, x + a, y + b)
  }],
  ['5 Pool of light', 'A faint patch of light lying on the surface, no lines. Hovered: the patch grows and brightens', (g, x, y, hot, t, i) => pool(g, x, y, hot ? 7 : 4, hot ? 4 : 2, hot ? .5 : .22 + Math.sin(t * 2 + i) * .06)],
  ['6 Ghost dragonfly', 'A pale dot. Hovered: a see-through dragonfly shows how it will sit there', (g, x, y, hot) => {
    if (!hot) return px(g, UI.ally, x - 1, y, 2, 2)
    const spr = wear(COLOR, [0, 0])(0, 0)[0]
    g.globalAlpha = .5
    g.drawImage(spr, x - (spr.width >> 1), y - (spr.height >> 1))
    g.globalAlpha = 1
  }],
]

const full = mk(W, H), fg = ctx(full)
const cards = LOOKS.map(([name, about]) => {
  const card = main.appendChild(document.createElement('section'))
  card.innerHTML = `<b>${name}</b><small>${about}</small><small>Left: nothing hovered. Right: the middle spot hovered. Top: rocks. Bottom: lily pads</small>`
  return CROPS.map(([, , w, h]) => {
    const row = card.appendChild(document.createElement('div'))
    return [0, 1].map(() => row.appendChild(mk(w, h)))
  })
})

function draw(ms: number) {
  LOOKS.forEach(([, , look], n) => [false, true].forEach((hover, s) => {
    fg.drawImage(ground(), 0, 0)
    PERCHES.forEach((r, i) => look(fg, r.x, Math.round(r.y - r.h * .7), hover && HOT.includes(r), ms / 1000, i))
    CROPS.forEach(([x, y, w, h], c) => ctx(cards[n][c][s]).drawImage(full, x, y, w, h, 0, 0, w, h))
  }))
  requestAnimationFrame(draw)
}

function fit() {
  const wide = Math.min(W * 3, innerWidth - 48)
  cards.flat(2).forEach(c => c.style.width = (wide - 12) / 2 + 'px')
}

addEventListener('resize', fit)
fit()
requestAnimationFrame(draw)
