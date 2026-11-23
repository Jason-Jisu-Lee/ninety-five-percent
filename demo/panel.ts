import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { WILD } from '../data/shop/wild'
import { frame } from '../ui/parts/frame'
import { icon, orb } from '../ui/parts/icons'
import { text, width } from '../ui/text/text'
import shot from './run.png'

const K = 2, ROW = 15, PITCH = 17, WIDE = 104, HAVE = 1, BLOOD = 46, LIST = WILD.slice(0, 6)

function slot(g: Ctx, i: number, x: number, y: number, w: number) {
  const { name, cost } = LIST[i], got = i < HAVE, next = i === HAVE, p = String(cost)
  frame(g, x, y, w, ROW, next && BLOOD >= cost)
  if (got) icon(g, 'tick', x + 6, y + 4, UI.accent)
  text(g, name, x + (got ? 17 : 6), y + 11, got ? UI.dim : next ? UI.text : UI.dim)
  if (got) return
  text(g, p, x + w - 6, y + 11, next ? UI.text : UI.dim, 'r')
  orb(g, x + w - 11 - width(p), y + 7, next ? '' : UI.dim)
}

const column = (x: number, y: number) => (g: Ctx) => {
  for (let i = 0; i < LIST.length; i++) slot(g, i, x, y + i * PITCH, WIDE)
}

const OPTIONS: [name: string, note: string, draw: (g: Ctx) => void][] = [
  ['Left column, under the blood counter', 'The prices sit next to the blood they are paid with. My pick', column(8, 30)],
  ['Right column, under the objective', 'Everything about progress in one corner. It pushes into the busiest part of the screen', column(W - 8 - WIDE, 62)],
  ['Bottom row', 'Like an action bar. It keeps the sides clear and uses the full width of the bottom edge', g => {
    for (let i = 0; i < LIST.length; i++) slot(g, i, 20 + i * 93, H - 23, 90)
  }],
  ['Left, the next upgrade only', 'One button. The least clutter, but the player cannot see what comes after', g => slot(g, HAVE, 8, 30, WIDE)],
]

const back = new Image()
back.src = shot
back.onload = () => OPTIONS.forEach(([name, note, draw], n) => {
  const fig = document.getElementById('options')!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(W * K, H * K)), g = ctx(c), low = ctx(mk(W, H))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${name}<br><i>${note}</i></figcaption>`)
  fig.style.width = W * K + 4 + 'px'
  g.imageSmoothingEnabled = false
  g.drawImage(back, 0, 0)
  draw(low)
  g.drawImage(low.canvas, 0, 0, W * K, H * K)
})
