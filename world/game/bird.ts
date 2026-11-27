import { sound } from '../../audio/player/sound'
import { save } from '../../core/save/save'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { PREY } from '../../data/enemies/enemies'
import { BIRD as B, WING } from '../../data/game/bird'
import { H, W } from '../../data/look/screen'
import type { hunt } from '../hunt/hunt'
import { G } from './state'

const half = ctx(mk(W / 2, H / 2)), OUTLINE = [...WING, ...WING.slice(1, -1).reverse().map(([x, y]) => [x, -y])]
const [fx, fy] = B.from, [tx, ty] = B.to, heading = Math.atan2(ty - fy, tx - fx)
const at = (t: number) => {
  const u = (t - B.shadow) / B.pass
  return u > 0 && u < 1 ? [fx + (tx - fx) * u, fy + (ty - fy) * u] : null
}

export function watch(sim: ReturnType<typeof hunt>, want: string, dt: number) {
  if (!save.bird && G.bird < -9 && want === 'ladybug' && save.count) G.bird = -B.wait
  if (sim.away) return void (G.bird = -99)
  if (G.bird <= -9) return
  if (G.bird < 0 && G.bird + dt >= 0) save.bird = true, sound('cry')
  scatter(sim, G.bird += dt, dt)
  if (G.bird > B.shadow + B.pass + B.fade) G.bird = -99
}

function scatter(sim: ReturnType<typeof hunt>, t: number, dt: number) {
  const s = at(t)
  if (s) for (const p of sim.prey.list) {
    const d = Math.hypot(p.x - s[0], p.y - s[1])
    if (p === sim.held || PREY[p.kind].zone === 'swarm' || !d || d > B.span * B.reach) continue
    p.wait = 0
    p.x += (p.x - s[0]) / d * B.flee * dt
    p.y += (p.y - s[1]) / d * B.flee * dt
    p.ang = Math.atan2(p.y - s[1], p.x - s[0])
  }
}

export function shadow(g: Ctx, t: number) {
  const s = at(t), k = B.span / 4, flex = 1 - .05 * Math.sin(t * 1.6)
  if (!s) return
  half.clearRect(0, 0, W / 2, H / 2)
  half.save()
  half.translate(s[0] / 2, s[1] / 2)
  half.rotate(heading)
  half.beginPath()
  OUTLINE.forEach(([px, py], i) => half[i ? 'lineTo' : 'moveTo'](px * k, py * k * flex))
  half.fillStyle = B.ink
  half.fill()
  half.restore()
  const img = half.getImageData(0, 0, W / 2, H / 2), d = img.data
  for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 110 ? 255 : 0
  half.putImageData(img, 0, 0)
  g.save()
  g.imageSmoothingEnabled = false
  g.globalAlpha = B.alpha
  g.drawImage(half.canvas, 0, 0, W, H)
  g.restore()
}
