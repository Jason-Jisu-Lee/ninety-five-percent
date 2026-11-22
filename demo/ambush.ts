import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { ACTS, BH, BW, frame, type Act } from '../ui/shop/skill'

const K = 3, LOOP = 3.6, dot = (g: Ctx, x: number, y: number, col = UI.foe) => {
  g.fillStyle = col
  g.fillRect(Math.round(x), Math.round(y), 1, 1)
}
const MARKS: [string, NonNullable<Act['mark']>][] = [
  ['The back flashes red once as it is bitten', (g, x, y, ang, since) => {
    if (since < 0 || since > .2) return
    for (let i = 1; i < 4; i++) for (let j = -1; j < 2; j++) dot(g, x - Math.cos(ang) * i - Math.sin(ang) * j, y - Math.sin(ang) * i + Math.cos(ang) * j)
  }],
  ['Red arrows point at its back just before the bite', (g, x, y, ang, since) => {
    if (since < -.6 || since > .15) return
    for (const d of [7, 11]) for (let j = -2; j < 3; j++) dot(g, x - Math.cos(ang) * (d + Math.abs(j)) - Math.sin(ang) * j, y - Math.sin(ang) * (d + Math.abs(j)) + Math.cos(ang) * j, since < 0 ? UI.foe : UI.text)
  }],
  ['Red streaks burst from its back on the bite', (g, x, y, ang, since) => {
    if (since < 0 || since > .3) return
    for (const turn of [-.7, 0, .7]) for (let i = 4 + since * 20; i < 9 + since * 20; i++) dot(g, x - Math.cos(ang + turn) * i, y - Math.sin(ang + turn) * i)
  }],
]

const views = MARKS.map(([name], n) => {
  const fig = document.querySelector('main')!.appendChild(document.createElement('figure')), g = ctx(fig.appendChild(mk(BW * K, BH * K)))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${name}</figcaption>`)
  g.imageSmoothingEnabled = false
  return g
})

function tick(now: number) {
  requestAnimationFrame(tick)
  const t = now / 1000 % LOOP
  views.forEach((g, n) => {
    g.fillStyle = UI.night
    g.fillRect(0, 0, BW * K, BH * K)
    if (t < 2.6) g.drawImage(frame({ ...ACTS.Ambush, mark: MARKS[n][1] }, t), 0, 0, BW * K, BH * K)
  })
}
requestAnimationFrame(tick)
