import { sound } from '../audio/player/sound'
import { ctx, mk } from '../core/screen/canvas'
import { LUNGE } from '../data/dragonfly/fight'
import { UI } from '../data/look/palette'
import { key } from '../ui/parts/key'
import { marks } from '../ui/parts/marks'
import { ACTS, BH, BW, frame, MID, type Act } from '../ui/shop/skill'

const L = ACTS.Lunge, K = 3, SEEN = 130, BAR = 40, AUTO = L.cue! * L.hit, PACE = 1 / (L.hit * (L.cue! + LUNGE.speed * (1 - L.cue!))), REST = 1.9
const at = (far: number) => Math.round(BAR * (1 - Math.min(SEEN, Math.max(0, far)) / SEEN))
const CUES: [string, NonNullable<Act['sign']>][] = [
  ['An S key shows over the dragonfly for as long as the press counts', (g, _x, _y, fly, _far, s) => s && key(g, fly - 5, MID - 30 + +(s > 1), 'S')],
  ['The lock marks on the enemy turn gold for as long as the press counts', (g, x, y, _fly, _far, s) => marks(g, x, y, 12, s ? UI.gold : UI.foe)],
  ['A marker runs along a bar under the enemy. Press while it is in the gold part', (g, x, y, _fly, far) => {
    const left = x - BAR / 2, top = y + 16
    g.fillStyle = UI.panel
    g.fillRect(left - 1, top - 1, BAR + 2, 5)
    g.fillStyle = UI.dim
    g.fillRect(left, top, BAR, 3)
    g.fillStyle = UI.gold
    g.fillRect(left + at(LUNGE.far), top, at(LUNGE.near) - at(LUNGE.far), 3)
    g.fillStyle = UI.text
    g.fillRect(left + Math.min(BAR - 1, at(far)), top - 2, 1, 7)
  }],
]
const out = document.querySelector('output')!, views = CUES.map(([caption, sign], n) => {
  const fig = document.querySelector('section')!.appendChild(document.createElement('figure')), g = ctx(fig.appendChild(mk(BW * K, BH * K)))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${caption}</figcaption>`)
  g.imageSmoothingEnabled = false
  return { g, sign }
})
let auto = true, start = performance.now() / 1000, press = -1, used = false, gap = SEEN, heard = false

function act(sign?: Act['sign']): Act {
  const tp = auto ? AUTO : press
  if (tp < 0) return { ...L, sign, cue: undefined, hit: 1 / PACE, bonus: 1, jolt: false }
  const hit = tp + (1 - PACE * tp) / (LUNGE.speed * PACE)
  return { ...L, sign, cue: tp / hit, hit }
}

addEventListener('keydown', e => {
  if (e.key.toLowerCase() !== 's' || e.repeat) return
  const t = performance.now() / 1000 - start
  if (auto) [auto, start, press, used, heard] = [false, performance.now() / 1000, -1, false, false]
  else if (!used && t < 1 / PACE) {
    used = true
    if (gap >= LUNGE.near && gap <= LUNGE.far) press = t
    out.textContent = gap > LUNGE.far ? 'too early' : gap < LUNGE.near ? 'too late' : 'in time'
  }
})
document.querySelector('button')!.onclick = () => [auto, start, heard] = [true, performance.now() / 1000, false]

function tick() {
  requestAnimationFrame(tick)
  const now = performance.now() / 1000, one = act(), stop = one.jolt ? LUNGE.freeze : 0
  let t = now - start
  if (t > one.hit + stop + REST) [start, press, used, heard, t] = [now, -1, false, false, 0]
  if (stop && t >= one.hit && !heard) {
    heard = true
    sound('thump')
  }
  for (const v of views) {
    const a = act((g, x, y, fly, far, s) => {
      gap = far
      v.sign(g, x, y, fly, far, s)
    })
    v.g.fillStyle = UI.night
    v.g.fillRect(0, 0, BW * K, BH * K)
    if (t < a.hit + stop + 1.1) v.g.drawImage(frame(a, t < a.hit ? t : Math.max(a.hit, t - stop)), 0, 0, BW * K, BH * K)
  }
}
tick()
