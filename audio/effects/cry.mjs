import { SR, TAU } from '../chip/tables.mjs'

const LEN = 1.4, FROM = 1900, TOP = 2400, TO = 1400, RASP = .35, TAIL = 2.6, DAMP = .1, WET = .75, LOUD = .08, ECHO = [.0297, .0371, .0411, .0437]
const lowpass = c => {
  let y = 0
  return x => y += c * (x - y)
}

export function cry() {
  let seed = 876202891, ph = 0, drift = 0, lo = 0, bp = 0
  const rnd = () => (seed = seed * 1664525 + 1013904223 >>> 0) / 2 ** 31 - 1, wob = lowpass(.002), soft = lowpass(DAMP)
  const dry = Float32Array.from({ length: Math.ceil(LEN * SR) }, (_, i) => {
    const t = i / SR, u = t / LEN
    drift = drift * .999 + rnd() * .0006
    const f = (u < .08 ? FROM + (TOP - FROM) * u / .08 : TOP + (TO - TOP) * ((u - .08) / .92) ** .8) * (1 + drift + .012 * Math.sin(TAU * 31 * t))
    ph += f / SR
    const tone = Math.sin(TAU * ph) + .55 * Math.sin(2 * TAU * ph + .4) + .3 * Math.sin(3 * TAU * ph + 1.1) + .14 * Math.sin(4 * TAU * ph)
    const grit = 1 + RASP * wob(rnd()) * 40, k = 2 * Math.sin(Math.PI * Math.min(f, SR / 6) / SR), hp = rnd() - lo - bp / 6
    bp += k * hp
    lo += k * bp
    return (tone * grit * .5 + bp * .9) * (Math.min(1, t / .04) * Math.min(1, (LEN - t) / .25) * (1 - .35 * u))
  })
  const lines = ECHO.map(d => ({ buf: new Float32Array(Math.round(d * SR)), i: 0, lp: lowpass(.3) }))
  const out = Float32Array.from({ length: dry.length + Math.ceil(TAIL * SR) }, (_, i) => {
    const x = soft(i < dry.length ? dry[i] : 0)
    let sum = 0
    for (const l of lines) {
      const y = l.buf[l.i]
      l.buf[l.i] = x + l.lp(y) * .8
      l.i = (l.i + 1) % l.buf.length
      sum += y
    }
    return x * (1 - WET) + sum * WET * .25
  })
  const max = out.reduce((m, x) => Math.max(m, Math.abs(x)), 0)
  return out.map((x, i) => x * (LOUD / max * Math.min(1, (out.length - i) / (SR * .05))))
}
