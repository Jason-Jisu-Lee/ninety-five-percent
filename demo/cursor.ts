import { adopt, save } from '../core/save/save'
import { ctx, mk } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { DESK, H, W } from '../data/look/screen'
import { feastButton } from '../ui/feast/button'
import type { Prey } from '../world/creatures/prey'
import { render } from '../world/game/render'
import { hunt } from '../world/hunt/hunt'
import { place } from '../world/place/place'
import { image, paint } from './cursor/image'
import { STYLES } from './cursor/styles'

adopt({ color: save.color })

const S = 24 * DESK * 16 / Math.hypot(16, 9) / W, K = Math.ceil(S), [CX, CY, CW, CH] = [232, 100, 112, 92], UW = 84, UH = 46, T = 20
const sim = hunt(), plain = ctx(mk(W, H)), live = ctx(mk(W, H)), still = ctx(mk(W, H)), lit = ctx(mk(W, H)), rest = feastButton(() => {}), button = feastButton(() => {}), host = document.querySelector('section')!
let on = -1, at = [0, 0], hot: Prey | null = null, clock = 0, last = -1
rest.draw(still)

const views = STYLES.map((s, n) => {
  const fig = host.appendChild(document.createElement('figure')), c = fig.appendChild(mk(CW * K, CH * K)), tile = mk(T * 2 * 3, T * 3), g = ctx(tile), small = ctx(mk(T * 2, T))
  Object.assign(c.style, { width: CW * S + 'px', height: CH * S + 'px', cursor: image(s, S) })
  c.onpointermove = e => [on, at] = [n, [e.offsetX / S + CX, e.offsetY / S + CY]]
  c.onpointerleave = () => on = -1
  small.drawImage(place().art, 284, 196, T, T, 0, 0, T, T)
  small.fillStyle = UI.panel
  small.fillRect(T, 0, T, T)
  for (const x of [0, T]) paint(small, s, x + (s.hot[0] ? 5 : 6), s.hot[1] ? 5 : 4)
  g.imageSmoothingEnabled = false
  g.drawImage(small.canvas, 0, 0, T * 6, T * 3)
  fig.appendChild(document.createElement('figcaption')).append(tile, Object.assign(document.createElement('div'), { innerHTML: `<b>${n + 1}</b>${s.name}<i>${s.note}</i>` }))
  return ctx(c)
})

function tick(now: number) {
  requestAnimationFrame(tick)
  const dt = last < 0 ? 0 : Math.min(.05, (now - last) / 1000), { fly } = sim
  last = now
  sim.idle(dt, clock += dt)
  hot = on < 0 ? null : sim.prey.at(at[0], at[1], hot)
  render(plain, sim, clock, true, null, false)
  if (on >= 0) {
    render(live, sim, clock, true, hot, !hot && Math.hypot(at[0] - fly.x, at[1] - fly.y + fly.h * .7) < 13)
    button.hover(at[0] - CX - CW + W, at[1] - CY - UH + H)
    lit.clearRect(0, 0, W, H)
    button.draw(lit)
  } else button.hover(-1, -1)
  views.forEach((g, n) => {
    g.imageSmoothingEnabled = false
    g.drawImage((n === on ? live : plain).canvas, CX, CY, CW, CH, 0, 0, CW * K, CH * K)
    g.drawImage((n === on ? lit : still).canvas, W - UW, H - UH, UW, UH, (CW - UW) * K, 0, UW * K, UH * K)
  })
}
requestAnimationFrame(tick)
