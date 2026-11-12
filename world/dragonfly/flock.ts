import { u32 } from '../../core/canvas'
import { pixels } from '../../core/pixels'
import { BODY, DF, WING } from '../../data/dragonfly'
import { sprite } from './sprite'

function phases(f: number) {
  if (f >= DF.flapFrames) return f === DF.flapFrames ? [.12, .12] : [-.18, -.18]
  const p = 2 * Math.PI * f / DF.flapFrames
  return [DF.amp * Math.sin(p), DF.amp * Math.sin(p + DF.hindLead)]
}

export function flock(variant: keyof typeof BODY, outline: boolean) {
  const S = DF.S, spr: HTMLCanvasElement[][] = [], sh: HTMLCanvasElement[][] = []
  for (let h = 0; h < DF.headings; h++) {
    const a = h * 2 * Math.PI / DF.headings
    spr.push([])
    sh.push([])
    for (let f = 0; f < DF.frames; f++) {
      const [pf, ph] = phases(f), shade = pixels(S, S)
      spr[h].push(sprite(a, pf, ph, BODY[variant], DF.lift, outline).p.done())
      sprite(a, pf, ph, BODY[variant], 0, false).cover.forEach((v, i) => {
        const x = i % S, y = i / S | 0
        if (v & 2 ? x + y & 1 : v & 1 && !(x & 1 || y & 1)) shade.u[i] = u32(WING.shadow)
      })
      sh[h].push(shade.done())
    }
  }
  return { spr, sh }
}
