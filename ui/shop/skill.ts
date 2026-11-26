import { num } from '../../core/math/num'
import { sound } from '../../audio/player/sound'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { dissolve } from '../../core/draw/dissolve'
import { own, save } from '../../core/save/save'
import { DF } from '../../data/dragonfly/body'
import { LUNGE } from '../../data/dragonfly/fight'
import { FLY } from '../../data/dragonfly/flight'
import { cast, PREY } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { drawPrey } from '../../world/creatures/draw'
import type { Prey } from '../../world/creatures/prey'
import { span } from '../../world/creatures/span'
import { wear } from '../../world/dragonfly/sprite/sheet'
import { place, where } from '../../world/place/place'
import { key } from '../parts/key'
import { marks } from '../parts/marks'
import { squeeze } from '../parts/squeeze'
import { text } from '../text/text'

type Act = { hit: number; bonus: number; slide: number; rush?: boolean; cue?: number; jolt?: boolean; foe(t: number): number[]; mark?(g: Ctx, x: number, y: number, ang: number, since: number): void }

const BW = 176, BH = 112, MID = 60, X = 432, Y = 100, RUN = 2.2, FADE = .4, WAIT = 1, EDGE = .25, GLIDE = .6, stage = ctx(mk(BW, BH))
const ACTS: Record<string, Act> = {
  'Lunge': { hit: 1.5, bonus: 2, slide: 12, cue: .86, jolt: true, foe: () => [126, -1.2] },
  'Ambush': {
    hit: 1.4, bonus: 2, slide: 10, foe: t => [84 + 30 * Math.min(1, t / 1.4), 0],
    mark(g, x, y, ang, since) {
      g.fillStyle = since < 0 ? UI.foe : UI.text
      if (since > -.6 && since < .15) for (const d of [7, 11]) for (let j = -2; j < 3; j++) g.fillRect(Math.round(x - Math.cos(ang) * (d + Math.abs(j)) - Math.sin(ang) * j), Math.round(y - Math.sin(ang) * (d + Math.abs(j)) + Math.cos(ang) * j), 1, 1)
    },
  },
  'Dive Strike': { hit: .8, bonus: 2, slide: 26, rush: true, foe: () => [112, Math.PI] },
}
let playing = '', from = 0, heard = -1

function frame(act: Act, t: number) {
  const kind = cast(where.stage).find(k => PREY[k].zone !== 'swarm')!, k = PREY[kind], bit = t >= act.hit, n = DF.flapFrames, mouth = DF.mouth * DF.scale + k.len / 2, u = Math.min(1, t / act.hit), cue = act.cue ?? 2
  const pre = cue / (cue + LUNGE.speed * (1 - cue)), pace = u < cue ? u * pre / cue : pre + (u - cue) / (1 - cue) * (1 - pre), glide = act.slide * (1 - (1 - Math.min(1, Math.max(0, t - act.hit) / GLIDE)) ** 2)
  const fx = -14 + (act.foe(act.hit)[0] - mouth + 14) * (act.cue ? pace : u) + glide, [ex, ang] = bit ? [fx + mouth, act.foe(act.hit)[1]] : act.foe(t), ey = bit ? MID : MID + Math.sin(t * 3) * 2
  const foe = { kind, x: ex, y: ey + (bit ? FLY.height : k.h) * .7, h: bit ? FLY.height : k.h, ang, hp: k.hp, wings: true, flash: bit && t < act.hit + .1 ? 1 : 0, seed: .3 } as Prey
  const [fly, shade] = wear(save.color)(8, Math.floor(t * FLY.beat * n * (bit ? 1.3 : 1)) % n, bit ? 1 + +(t * 3 % 1 > .5) : 0), half = fly.width >> 1, far = ex - fx - mouth
  stage.drawImage(place().art, W / 2 - BW / 2, H / 2 - BH / 2, BW, BH, 0, 0, BW, BH)
  drawPrey(stage, foe, t, true)
  stage.drawImage(shade, Math.round(fx + FLY.height * .45) - half, Math.round(MID + FLY.height * .7) - half)
  if ((act.rush || u >= cue) && !bit) for (const [dx, dy, len] of [[-22, -5, 9], [-28, 1, 13], [-21, 6, 8]]) {
    stage.fillStyle = place().look.water[4]
    stage.fillRect(Math.round(fx + dx - len), MID + dy, len, 1)
  }
  drawPrey(stage, foe, t)
  if (act.cue && !bit) marks(stage, Math.round(ex), Math.round(ey), squeeze(span(foe), far), UI.foe)
  if (act.cue && !bit && far <= LUNGE.far) key(stage, Math.round(fx) - 5, MID - 30, 'S', u >= cue)
  act.mark?.(stage, ex, ey, ang, t - act.hit)
  stage.drawImage(fly, Math.round(fx) - half, MID - half)
  if (bit && t < act.hit + .7) text(stage, num(own('power') * act.bonus), Math.round(ex), Math.round(MID - 12 - (t - act.hit) * 22), UI.gold, 'c', UI.panel)
  return stage.canvas
}

export function skill(g: Ctx, name = '') {
  const now = performance.now() / 1000
  if (ACTS[name] && name !== playing) [playing, from] = [name, now]
  const act = ACTS[playing], t = (now - from) % (RUN + FADE + WAIT), turn = (now - from) / (RUN + FADE + WAIT) | 0, stop = act?.jolt ? LUNGE.freeze : 0
  if (!act || t > RUN + FADE) return
  if (stop && t >= act.hit && heard !== from + turn) {
    heard = from + turn
    sound('thump')
  }
  dissolve(g, frame(act, t < act.hit ? t : Math.max(act.hit, t - stop)), X, Y, Math.min(1, t / EDGE, (RUN + FADE - t) / FADE))
}
