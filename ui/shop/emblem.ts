import { dither } from '../../core/draw/dither'
import { pixels } from '../../core/draw/pixels'
import { once } from '../../core/math/once'
import { u32 } from '../../core/screen/canvas'
import { DF } from '../../data/dragonfly/body'
import { COLOR } from '../../data/dragonfly/colors'
import { UI } from '../../data/look/palette'
import { look } from '../../world/dragonfly/sprite/look'
import { size, sprite } from '../../world/dragonfly/sprite/sprite'

const K = 7

export const emblem = once(() => {
  const col = look(COLOR), from = sprite(0, 0, 0, col, DF.lift, 0, K, true), S = size(K), p = pixels(S, S), skip = u32(col.fill), soft = [col.abd, col.thorax, col.thoraxHi, col.head].map(u32)
  from.p.u.forEach((v, i) => {
    if (v && v !== skip && (!soft.includes(v) || dither(i % S, i / S | 0, .5))) p.u[i] = u32(UI.line)
  })
  return p.done()
})
