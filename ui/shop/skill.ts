import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { dissolve } from '../../core/draw/dissolve'
import { own } from '../../core/save/save'
import { DF } from '../../data/dragonfly/body'
import { COLOR } from '../../data/dragonfly/colors'
import { FLY } from '../../data/dragonfly/flight'
import { cast, PREY } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { drawPrey } from '../../world/creatures/draw'
import type { Prey } from '../../world/creatures/prey'
import { wear } from '../../world/dragonfly/sprite/sheet'
import { place, where } from '../../world/place/place'
import { text } from '../text/text'

type Act = { hit: number; rush: boolean; foe(t: number): number[] }

const X = 432, Y = 100, BW = 176, BH = 112, MID = 60, RUN = 2.2, FADE = .4, WAIT = 1, EDGE = .25, stage = ctx(mk(BW, BH))
const ACTS: Record<string, Act> = {
  'Dive Strike': { hit: 1.15, rush: true, foe: () => [132, Math.PI] },
  'Ambush': { hit: 1.4, rush: false, foe: t => [84 + 30 * Math.min(1, t / 1.4), 0] },
}
let playing = '', from = 0

export function skill(g: Ctx, name = '') {
  const now = performance.now() / 1000
  if (ACTS[name] && name !== playing) [playing, from] = [name, now]
  const act = ACTS[playing], t = (now - from) % (RUN + FADE + WAIT)
  if (!act || t > RUN + FADE) return
  const kind = cast(where.stage).find(k => PREY[k].zone !== 'swarm')!, k = PREY[kind], bit = t >= act.hit, n = DF.flapFrames, mouth = DF.mouth * DF.scale + k.len / 2, u = Math.min(1, t / act.hit), fx = -14 + (act.foe(act.hit)[0] - mouth + 14) * (act.rush ? u * u : u)
  const [ex, ang] = bit ? [fx + mouth, act.foe(act.hit)[1]] : act.foe(t), ey = bit ? MID : MID + Math.sin(t * 3) * 2
  const foe = { kind, x: ex, y: ey + (bit ? FLY.height : k.h) * .7, h: bit ? FLY.height : k.h, ang, hp: k.hp, wings: true, flash: bit && t < act.hit + .1 ? 1 : 0, seed: .3 } as Prey
  const [fly, shade] = wear(COLOR)(8, Math.floor(t * FLY.beat * n * (bit ? 1.3 : 1)) % n, bit ? 1 + +(t * 3 % 1 > .5) : 0), half = fly.width >> 1, fy = MID + FLY.height * .7
  stage.drawImage(place().art, W / 2 - BW / 2, H / 2 - BH / 2, BW, BH, 0, 0, BW, BH)
  drawPrey(stage, foe, t, true)
  stage.drawImage(shade, Math.round(fx + FLY.height * .45) - half, Math.round(fy) - half)
  if (act.rush && !bit && t > act.hit * .5) for (const [dx, dy, len] of [[-22, -5, 9], [-28, 1, 13], [-21, 6, 8]]) {
    stage.fillStyle = place().look.water[4]
    stage.fillRect(Math.round(fx + dx - len), MID + dy, len, 1)
  }
  drawPrey(stage, foe, t)
  stage.drawImage(fly, Math.round(fx) - half, MID - half)
  if (bit && t < act.hit + .7) text(stage, String(+(own('power') * 2).toFixed(2)), Math.round(ex), Math.round(MID - 12 - (t - act.hit) * 22), UI.gold, 'c', UI.panel)
  dissolve(g, stage.canvas, X, Y, Math.min(1, t / EDGE, (RUN + FADE - t) / FADE))
}
