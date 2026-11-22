import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { blood } from '../ui/blood/blood'
import { text, width } from '../ui/text/text'
import { place } from '../world/place/place'

type Show = (g: Ctx, bonus: number, left: number, cap: number, x: number) => void

const K = 3, CW = 170, CH = 64, CAP = 5, bar = (g: Ctx, x: number, y: number, w: number, h: number, col: string) => {
  g.fillStyle = col
  g.fillRect(x, y, w, h)
}
const SHOWS: [string, Show][] = [
  ['Under the blood: the bonus, and a bar that runs out in 10 seconds', (g, bonus, left) => {
    text(g, `+${bonus * 10}%`, 24, 32, UI.accent, undefined, UI.panel)
    bar(g, 23, 34, 28, 4, UI.panel)
    bar(g, 24, 35, Math.ceil(26 * left), 2, UI.accent)
  }],
  ['Under the blood: one pip per 10%, and the same bar', (g, bonus, left, cap) => {
    for (let i = 0; i < cap; i++) {
      bar(g, 23 + i * 7, 24, 6, 6, UI.panel)
      bar(g, 24 + i * 7, 25, 4, 4, i < bonus ? UI.gold : UI.line)
    }
    bar(g, 23, 32, cap * 7, 4, UI.panel)
    bar(g, 24, 33, Math.ceil((cap * 7 - 2) * left), 2, UI.gold)
  }],
  ['Beside the blood: a multiplier, and a small bar that runs down', (g, bonus, left, _cap, x) => {
    text(g, 'x' + (1 + bonus / 10).toFixed(1), x + 8, 19, UI.gold, undefined, UI.panel)
    bar(g, x + 28, 10, 4, 11, UI.panel)
    bar(g, x + 29, 20 - Math.ceil(9 * left), 2, Math.ceil(9 * left), UI.gold)
  }],
]

const views = SHOWS.map(([name], n) => {
  const fig = document.querySelector('main')!.appendChild(document.createElement('figure')), g = ctx(fig.appendChild(mk(CW * K, CH * K)))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${name}</figcaption>`)
  g.imageSmoothingEnabled = false
  g.setTransform(K, 0, 0, K, 0, 0)
  return g
})

function tick(now: number) {
  requestAnimationFrame(tick)
  const t = now / 1000 % 26, caught = Math.min(6, Math.floor(t / 2.5)), since = t - caught * 2.5, bonus = since > 10 ? 0 : Math.min(CAP, caught), n = 37 + caught + bonus * .1
  views.forEach((g, i) => {
    g.drawImage(place().art, 0, 0)
    blood(g, n)
    if (bonus) SHOWS[i][1](g, bonus, 1 - since / 10, CAP, 24 + width(String(Math.floor(n))))
  })
}
requestAnimationFrame(tick)
