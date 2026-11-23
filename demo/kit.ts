import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { W } from '../data/look/screen'
import { text, width } from '../ui/text/text'
import { pond } from '../world/place/pond'
import navShot from './quest-nav.png'

export const K = 2, R = W - 8, OLD = 'Catch 3 fruit flies', art = pond(12).art
const nav = Object.assign(new Image(), { src: navShot }), TICK = ['......#', '.....##', '#...##.', '##.##..', '.###...', '..#....']

export function view(label: string, w: number, h: number, left = 0) {
  const fig = document.getElementById('options')!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(w * K, h * K)), g = ctx(c), low = ctx(mk(w, h))
  fig.insertAdjacentHTML('beforeend', `<figcaption>${label}</figcaption>`)
  fig.style.width = w * K + 4 + 'px'
  g.imageSmoothingEnabled = false
  return {
    fig, c, low,
    show() {
      g.drawImage(low.canvas, 0, 0, w * K, h * K)
      if (nav.complete) g.drawImage(nav, (480 - left) * K, 0)
    },
  }
}

export function tick(g: Ctx, x: number, y: number) {
  for (const [col, n] of [[UI.panel, 9], [UI.accent, 1]] as const) for (let k = 0; k < n; k++) {
    g.fillStyle = col
    TICK.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) if (row[i] === '#') g.fillRect(x + i + (n > 1 ? k % 3 - 1 : 0), y + j + (n > 1 ? (k / 3 | 0) - 1 : 0), 1, 1)
    })
  }
}

export function quest(g: Ctx, name: string, sub: string, col: string, dx = 0, done = false) {
  text(g, name, R + dx, 41, col, 'r', UI.panel)
  if (sub) text(g, sub, R + dx, 53, UI.accent, 'r', UI.panel)
  if (done) tick(g, R + dx - width(name) - 11, 35)
}
