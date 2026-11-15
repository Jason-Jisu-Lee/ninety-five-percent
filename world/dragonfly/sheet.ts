import { u32 } from '../../core/canvas'
import { dither } from '../../core/dither'
import { pixels } from '../../core/pixels'
import { DF, REST, WING, type Color } from '../../data/dragonfly'
import { look, type Look } from './look'
import { size, sprite } from './sprite'

function sheet(col: Look, K: number) {
  const S = size(K), cache = new Map<number, HTMLCanvasElement[]>(), n = DF.flapFrames
  return (heading: number, frame: number, grab = false) => {
    const key = heading * 64 + frame * 2 + +grab, hit = cache.get(key)
    if (hit) return hit
    const a = heading * 2 * Math.PI / DF.headings, shade = pixels(S, S), tilt = (frame - n) % 3 * REST.tilt * (frame > n + 1 ? -.5 : 1)
    const [pf, ph] = frame < n ? [0, DF.hindLead].map(o => DF.amp * Math.sin(2 * Math.PI * frame / n + o)) : [tilt, tilt]
    sprite(a, pf, ph, col, 0, grab, K).cover.forEach((v, i) => {
      if (v && dither(i % S, i / S | 0, v & 2 ? .5 : .25)) shade.u[i] = u32(WING.shadow)
    })
    const made = [sprite(a, pf, ph, col, DF.lift, grab, K, frame >= n).p.done(), shade.done()]
    cache.set(key, made)
    return made
  }
}

const made = new Map<string, ReturnType<typeof sheet>>()

export function wear(color: Color, st: number[], K = DF.scale) {
  const key = color + st + K
  if (!made.has(key)) {
    if (made.size > 8) made.clear()
    made.set(key, sheet(look(color, st), K))
  }
  return made.get(key)!
}
