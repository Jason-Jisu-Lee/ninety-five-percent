import { CHUNK, FS, OS, SR, TAPS, TAU } from './tables.mjs'

export function taps() {
  const h = new Float64Array(TAPS), fc = 21300 / FS, mid = (TAPS - 1) / 2
  const bess = x => {
    let s = 1, t = 1
    for (let k = 1; k < 32; k++) s += t *= (x / 2 / k) ** 2
    return s
  }
  let sum = 0
  for (let n = 0; n < TAPS; n++) {
    const x = n - mid
    sum += h[n] = (x ? Math.sin(TAU * fc * x) / (Math.PI * x) : 2 * fc) * bess(9 * Math.sqrt(1 - (x / mid) ** 2))
  }
  return h.map(v => v / sum)
}

export function shrink(h, out) {
  const all = new Float64Array(TAPS - 1 + CHUNK)
  return (x, at) => {
    all.set(x, TAPS - 1)
    for (let k = 0; k < CHUNK / OS && at + k < out.length; k++) {
      let a = 0
      for (let j = 0, p = k * OS; j < TAPS; j++) a += h[j] * all[p + j]
      out[at + k] = a
    }
    all.copyWithin(0, CHUNK)
  }
}

export function master(x, fade, tone) {
  const hp = 1 / (1 + TAU * 25 / SR), lp = 1 - Math.exp(-TAU * tone / SR)
  let a = 0, b = 0, c = 0, d = 0, peak = 0, sum = 0
  for (let i = 0; i < x.length; i++) {
    a = hp * (a + x[i] - b)
    b = x[i]
    c += lp * (a - c)
    d += lp * (c - d)
    x[i] = d * Math.min(1, (x.length - i) / fade) ** 2
    peak = Math.max(peak, Math.abs(x[i]))
    sum += x[i] ** 2
  }
  return [peak, sum]
}
