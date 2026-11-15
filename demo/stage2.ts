import { turn } from '../core/math/angle'
import { clamp } from '../core/math/clamp'
import { vnoise } from '../core/math/noise'
import { ctx } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { COLOR } from '../data/dragonfly/colors'
import { cast, PREY } from '../data/enemies/enemies'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { onLog } from '../data/stage1/map'
import { BEDS, BOULDERS, INSET, LOG2, STUMP } from '../data/stage2/map'
import { text } from '../ui/text/text'
import { drawBug, type Bug } from '../world/creatures/draw'
import { wear } from '../world/dragonfly/sprite/sheet'
import { ground } from '../world/stage1/scenery/ground'
import { ground2 } from '../world/stage2/scenery/ground'

const R = Math.random, canvas = document.querySelector('canvas')!, g = ctx(canvas), SMALL = 3, TIME = 3.2
const SPOTS: Record<string, () => number[]> = {
  flowers: () => BEDS[R() * BEDS.length | 0].map((v, i) => i < 2 ? v + (R() - .5) * 30 : v),
  sites: () => [...BOULDERS, [STUMP.x, STUMP.y], onLog(LOG2, 60 + R() * 150, -2)][R() * (BOULDERS.length + 2) | 0],
  cross: () => [40 + R() * (W - 80), 40 + R() * (H - 80)],
  water: () => [[150, 214], [262, 230]][R() * 2 | 0],
}
const half = (k: Bug) => ({ ...k, len: k.len / 2, wide: k.wide / 2, wing: k.wing / 2, chord: k.chord / 2 })
const kinds = [...cast(2).map(kind => PREY[kind]), ...cast(1).filter(kind => PREY[kind].len * INSET.k >= SMALL).map(kind => ({ ...PREY[kind], ...half(PREY[kind]), count: 2, speed: PREY[kind].speed / 2, h: PREY[kind].h * .7 }))]
const bugs = kinds.flatMap(k => Array.from({ length: k.count }, () => {
  const [x, y] = SPOTS[k.zone]()
  return { k, x, y, gx: x, gy: y, h: k.h, ang: R() * 6.283, wait: k.sit * R(), seed: R(), flash: 0, wings: true }
}))
let last = 0, zoom = 1, named = true

function step(dt: number, t: number) {
  for (const b of bugs) {
    const { k } = b, far = Math.hypot(b.gx - b.x, b.gy - b.y), sat = b.wait > 0 && far < 4
    b.h += ((sat && k.land ? 1 : k.h + Math.sin(t * 3 + b.seed * 9) * 2) - b.h) * Math.min(1, dt * 7)
    if (sat) {
      if ((b.wait -= dt) <= 0 && k.speed) [b.gx, b.gy] = SPOTS[k.zone]()
      continue
    }
    if (far < 4) b.wait = k.sit * (.5 + R()) || .01
    b.ang = turn(b.ang, Math.atan2(b.gy - b.y, b.gx - b.x) + (vnoise(t * 3, b.seed * 99, 3) - .5) * 2 * k.jink, k.turn * dt)
    b.x += Math.cos(b.ang) * k.speed * dt
    b.y += Math.sin(b.ang) * k.speed * dt
  }
}

function frame(now: number) {
  requestAnimationFrame(frame)
  const t = now / 1000, dt = Math.min(.05, t - last), u = zoom * zoom * (3 - 2 * zoom), s = 2 - u, a = t * .35
  const fx = W / 2 + Math.sin(a) * 96, fy = H / 2 + Math.sin(a * 2) * 34, ang = Math.atan2(Math.cos(a * 2) * 68, Math.cos(a) * 96)
  const [spr, shade] = wear(COLOR, [0, 0])(((Math.round((ang + Math.PI / 2) / 6.283 * DF.headings) % DF.headings) + DF.headings) % DF.headings, Math.floor(t * 32) % DF.flapFrames)
  last = t
  zoom = Math.min(1, zoom + dt / TIME)
  step(dt, t)
  g.imageSmoothingEnabled = false
  g.setTransform(s, 0, 0, s, W / 2 * (1 - s), H / 2 * (1 - s))
  g.drawImage(ground2(), 0, 0)
  g.globalAlpha = 1 - clamp((u - .45) / .45)
  g.drawImage(ground(), INSET.x, INSET.y, W * INSET.k, H * INSET.k)
  g.globalAlpha = 1
  g.setTransform(1, 0, 0, 1, 0, 0)
  if (zoom >= 1) for (const shadow of [true, false]) for (const b of bugs) drawBug(g, b.k, b, b.k.len, t, shadow)
  g.drawImage(shade, Math.round(fx + 7 - spr.width / 2), Math.round(fy + 10 - spr.height / 2))
  g.drawImage(spr, Math.round(fx - spr.width / 2), Math.round(fy - spr.height / 2))
  if (zoom >= 1 && named) for (const b of bugs) text(g, b.k.name, Math.round(b.x), Math.round(b.y - b.h * .7 - b.k.wing - b.k.wide / 2 - 5), UI.text, 'c', UI.panel)
}

function fit() {
  canvas.style.width = W * Math.max(1, Math.floor(Math.min(innerWidth / W, (innerHeight - 70) / H))) + 'px'
}

document.querySelector<HTMLElement>('#zoom')!.onclick = () => zoom = 0
document.querySelector<HTMLElement>('#names')!.onclick = () => named = !named
addEventListener('resize', fit)
fit()
requestAnimationFrame(frame)
