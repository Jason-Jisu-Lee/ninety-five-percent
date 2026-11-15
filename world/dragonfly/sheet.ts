import { u32 } from '../../core/canvas'
import { dither } from '../../core/dither'
import { pixels } from '../../core/pixels'
import { BODY, DF, WING } from '../../data/dragonfly'
import { size, sprite } from './sprite'

export function sheet(variant: keyof typeof BODY, K = DF.scale) {
  const S = size(K), cache = new Map<number, HTMLCanvasElement[]>()
  return (heading: number, frame: number, grab = false) => {
    const key = heading * 64 + frame * 2 + +grab, hit = cache.get(key)
    if (hit) return hit
    const a = heading * 2 * Math.PI / DF.headings, shade = pixels(S, S)
    const [pf, ph] = [0, DF.hindLead].map(o => frame < DF.flapFrames ? DF.amp * Math.sin(2 * Math.PI * frame / DF.flapFrames + o) : 0)
    sprite(a, pf, ph, BODY[variant], 0, grab, K).cover.forEach((v, i) => {
      if (v && dither(i % S, i / S | 0, v & 2 ? .5 : .25)) shade.u[i] = u32(WING.shadow)
    })
    const made = [sprite(a, pf, ph, BODY[variant], DF.lift, grab, K).p.done(), shade.done()]
    cache.set(key, made)
    return made
  }
}
