import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { cast, PREY } from '../data/enemies/enemies'
import { UI } from '../data/look/palette'
import { marks } from '../ui/parts/marks'
import { ACTS, BH, BW, frame } from '../ui/shop/skill'
import type { Prey } from '../world/creatures/prey'
import { span } from '../world/creatures/span'
import { where } from '../world/place/place'

const K = 3, HIT = 2.25, LOOP = 3.6, EARLY = .5, X = 126, MID = 60, act = { ...ACTS.Lunge, cue: undefined, hit: HIT, bonus: 1, jolt: false }
const R = span({ kind: cast(where.stage).find(k => PREY[k].zone !== 'swarm')! } as Prey), pad = ctx(mk(BW, BH))
const WAYS: [string, (g: Ctx, y: number, since: number) => void][] = [
  ['The marks blink off once', (g, y, since) => since < .12 || marks(g, X, y, R, UI.foe)],
  ['The marks flash white once', (g, y, since) => marks(g, X, y, R, since < .12 ? UI.text : UI.foe)],
  ['The marks shake sideways', (g, y, since) => marks(g, X + (since < .24 ? Math.round(Math.sin(since / .24 * Math.PI * 6) * 2) : 0), y, R, UI.foe)],
]
const views = WAYS.map(([caption, draw], n) => {
  const fig = document.querySelector('section')!.appendChild(document.createElement('figure')), g = ctx(fig.appendChild(mk(BW * K, BH * K)))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${caption}</figcaption>`)
  g.imageSmoothingEnabled = false
  return { g, draw }
})
let pressed = -9, was = 0

addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 's' && !e.repeat) pressed = performance.now() / 1000
})

function tick() {
  requestAnimationFrame(tick)
  const now = performance.now() / 1000, t = now % LOOP
  if (was < EARLY && t >= EARLY) pressed = now
  was = t
  for (const v of views) {
    pad.fillStyle = UI.night
    pad.fillRect(0, 0, BW, BH)
    if (t < HIT + 1.1) pad.drawImage(frame(act, t), 0, 0)
    if (t < HIT) v.draw(pad, Math.round(MID + Math.sin(t * 3) * 2), now - pressed)
    v.g.drawImage(pad.canvas, 0, 0, BW * K, BH * K)
  }
}
tick()
