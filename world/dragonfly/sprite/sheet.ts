import { dither } from '../../../core/draw/dither'
import { pixels } from '../../../core/draw/pixels'
import { u32 } from '../../../core/screen/canvas'
import { DF } from '../../../data/dragonfly/body'
import { WING, type Color } from '../../../data/dragonfly/colors'
import { REST, VARY } from '../../../data/dragonfly/flight'
import { look, type Look } from './look'
import { size, sprite } from './sprite'

const n = DF.flapFrames, HELD = [0, REST.tilt, -REST.tilt, VARY.dihedral]

function sheet(col: Look, K: number) {
  const S = size(K), cache = new Map<number, HTMLCanvasElement[]>()
  return (heading: number, frame: number, grab = 0, lean = 0) => {
    const key = heading * 1024 + frame * 16 + grab * 4 + lean + 1, hit = cache.get(key)
    if (hit) return hit
    const a = heading * 2 * Math.PI / DF.headings, shade = pixels(S, S), still = frame >= n && frame < n + 3
    const [pf, ph] = frame < n ? [0, DF.hindLead].map(o => DF.amp * Math.sin(2 * Math.PI * frame / n + o)) : [HELD[frame - n], HELD[frame - n]]
    sprite(a, pf, ph, col, 0, grab, K, still, lean).cover.forEach((v, i) => {
      if (v && dither(i % S, i / S | 0, v & 2 ? .5 : .25)) shade.u[i] = u32(WING.shadow)
    })
    const made = [sprite(a, pf, ph, col, DF.lift, grab, K, still, lean).p.done(), shade.done()]
    cache.set(key, made)
    return made
  }
}

const made = new Map<string, ReturnType<typeof sheet>>()

export function wear(color: Color, K = DF.scale) {
  const key = color + K
  if (!made.has(key)) {
    if (made.size > 4) made.clear()
    made.set(key, sheet(look(color), K))
  }
  return made.get(key)!
}
