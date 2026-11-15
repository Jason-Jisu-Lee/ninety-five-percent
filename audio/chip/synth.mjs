import { parse } from './mml.mjs'

export const SR = 48000
const OS = 4, FS = SR * OS, STEP = 16, TAPS = 127, CHUNK = 1 << 14, TAU = Math.PI * 2, RELEASE = .003 * FS
const DUTY = [.125, .25, .5, .75]
const VIB = [0, [.28, 10, 5.5], [.2, 18, 6], [.12, 30, 6.5]]
const KIND = { a: 'p', b: 'p', c: 'p', w: 'w', n: 'n', t: 't', s: 's' }
const MIX = { a: [.8, .5, 0], b: [.5, .8, 0], c: [.65, .65, 0], w: [.85, .85, 0], n: [.55, .55, 0], t: [.9, 1.1, 1], s: [.75, .6, .3] }
const HITS = {
  k: [15, 5000, 500, .018, 15, .11],
  s: [15, 22000, 8000, .025, 13, .15],
  h: [15, 131072, 131072, 1, 5, .04],
  o: [15, 131072, 131072, 1, 5, .22],
  c: [15, 90000, 30000, .25, 11, .8],
  t: [7, 16000, 9000, .06, 13, .2],
  m: [7, 24000, 14000, .06, 13, .18],
  z: [7, 9000, 2500, .03, 14, .09],
  w: [15, 3000, 40000, .12, 9, .25],
  u: [15, 20000, 700, .2, 13, .8],
  i: [15, 131072, 131072, 1, 5, .015],
  p: [15, 40000, 40000, 1, 12, .05],
}
const WAVES = [[1, .35, .15, .06], [1, .5, .33, .2, .1], [1, 0, .33, 0, .2, 0, .14], [1, .25, .08]].map(h => {
  const raw = Array.from({ length: 32 }, (_, i) => h.reduce((a, g, n) => a + g * Math.sin(TAU * (n + 1) * (i + .5) / 32), 0))
  const lo = Math.min(...raw), span = Math.max(...raw) - lo
  return [3, 2, 1, 0].map(shift => {
    const q = raw.map(x => Math.round((x - lo) / span * 15) >> shift), mean = q.reduce((a, b) => a + b) / 32
    const smp = q.map(x => (x - mean) / 15), cum = [0]
    for (const x of smp) cum.push(cum[cum.length - 1] + x)
    return { smp, cum }
  })
})

function voice(kind, list) {
  let i = 0, ph = 0, reg = 0x7fff, bit = .5, on
  return (out, s0) => {
    const end = s0 + out.length
    out.fill(0)
    for (let s = s0; s < end;) {
      while (i < list.length && list[i].s1 <= s) i++
      const e = list[i]
      if (!e || e.s0 >= end) break
      s = Math.max(s, e.s0)
      if (on !== e) {
        on = e
        reg = 0x7fff
        if (kind !== 'p') ph = 0
      }
      for (const stop = Math.min(end, e.s1); s < stop;) {
        const m = Math.min(stop, s + STEP), tt = (s - e.s0) / FS
        if (kind === 'n') {
          const [bits, f0, f1, ft, v, d] = e.hit
          const amp = Math.max(0, Math.ceil(v * e.v / 15 * (1 - tt / d))) / 15, inc = (f1 + (f0 - f1) * Math.exp(-tt / ft)) / FS
          for (let j = s - s0; j < m - s0; j++) {
            let rem = 1, acc = 0
            while (ph + rem * inc >= 1) {
              const dt = (1 - ph) / inc, b = (reg ^ reg >> 1) & 1
              acc += bit * dt
              rem -= dt
              ph = 0
              reg = reg >> 1 | b << 14
              if (bits === 7) reg = reg & ~64 | b << 6
              bit = reg & 1 ? -.5 : .5
            }
            acc += bit * rem
            ph += rem * inc
            out[j] = acc * amp
          }
        } else {
          const note = e.m.length ? e.m[(tt * 40 | 0) % e.m.length] : e.m, vb = VIB[e.vib]
          let f = 440 * 2 ** ((note - 69 + e.sw * tt / e.len) / 12)
          if (vb && tt > vb[0]) f *= 2 ** (vb[1] / 1200 * Math.sin(TAU * vb[2] * (tt - vb[0])))
          const inc = f / FS, tail = Math.min(1, (e.s1 - s) / RELEASE)
          if (kind === 't' || kind === 's') {
            const amp = e.v / 30 * tail * (kind === 't' ? Math.min(1, tt / .004) * Math.exp(-tt / e.tau)
              : e.x ? Math.min(1, tt / (e.x * .012)) : tt < e.rise ? tt / e.rise : Math.exp(-4.6 * (tt - e.rise) / (e.len - e.rise)))
            for (let j = s - s0; j < m - s0; j++) {
              if ((ph += inc) >= 1) ph--
              out[j] = (kind === 's' ? Math.sin(TAU * ph) : 1 - 4 * Math.abs((ph + .25) % 1 - .5)) * amp
            }
          } else {
            const d = DUTY[e.duty], tab = kind === 'w' && WAVES[e.duty % 4][Math.max(0, Math.min(3, e.v))]
            const amp = (tab ? 1 / 32 : (e.x ? Math.max(0, e.v - (tt * 64 / e.x | 0)) : e.v) / 15) * tail
            const G = tab
              ? u => {
                const x = u * 32, n = x | 0
                return tab.cum[n] + (x - n) * tab.smp[n]
              }
              : u => u < d ? u * (1 - d) : d * (1 - u)
            let g0 = G(ph)
            for (let j = s - s0; j < m - s0; j++) {
              if ((ph += inc) >= 1) ph--
              const g1 = G(ph)
              out[j] = (g1 - g0) / inc * amp
              g0 = g1
            }
          }
        }
        s = m
      }
    }
  }
}

function taps() {
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

function shrink(h, out) {
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

function master(x, fade, tone) {
  const hp = 1 / (1 + TAU * 25 / SR), lp = 1 - Math.exp(-TAU * tone / SR)
  let a = 0, b = 0, c = 0, d = 0, peak = 0, sum = 0
  for (let i = 0; i < x.length; i++) {
    a = hp * (a + x[i] - b)
    b = x[i]
    c += lp * (a - c)
    d += lp * (c - d)
    x[i] = d * Math.min(1, (x.length - i) / fade)
    peak = Math.max(peak, Math.abs(x[i]))
    sum += x[i] ** 2
  }
  return [peak, sum]
}

export function render({ bpm, swing = .5, echo = [.75, .35], send = {}, tone = 6500, ring = 0 }, src, seconds, fade = .005) {
  const at = t => {
    const b = t / 48, w = b % 1
    return (b - w + (w < .5 ? w * 2 * swing : swing + (w - .5) * 2 * (1 - swing))) * 60 / bpm
  }
  const voices = []
  let last = 0, turn = 0
  for (const [key, mml] of Object.entries(src)) {
    const kind = KIND[key[0]], lanes = [[], [], [], []], [gl, gr, gs] = MIX[key[0]]
    for (const n of parse(mml, kind === 'n').notes) {
      const s0 = Math.round(at(n.t) * FS), off = Math.round(at(n.t + n.d * n.q / 8) * FS), hit = HITS[n.m], tau = (n.x || 3) * .07
      if (kind === 'n' && !hit) throw Error(`no drum "${n.m}"`)
      if (kind === 't' || kind === 's') [n.m].flat().forEach((m, c) => lanes[kind === 't' ? turn++ % 4 : c % 4].push({ ...n, m, s0, s1: kind === 't' ? s0 + tau * 7 * FS | 0 : off, tau }))
      else lanes[0].push({ ...n, s0, s1: kind === 'n' ? s0 + hit[5] * FS | 0 : off, hit })
    }
    for (const list of lanes) {
      list.forEach((e, j) => {
        if (list[j + 1]) e.s1 = Math.min(e.s1, list[j + 1].s0)
        e.len = (e.s1 - e.s0) / FS
        e.rise = Math.min(e.len * .35, 1.2)
        last = Math.max(last, e.s1)
      })
      if (list.length) voices.push({ gain: [gl, gr, send[key] ?? gs], fill: voice(kind, list) })
    }
  }
  const n = Math.ceil((seconds ?? last / FS + .03 + ring) * SR), outs = [0, 1, 2, 3].map(() => new Float32Array(n)), [l, r, el, er] = outs, h = taps()
  const one = new Float64Array(CHUNK), bus = outs.map(() => new Float64Array(CHUNK)), down = outs.map(o => shrink(h, o)), D = Math.round(echo[0] * 60 / bpm * SR)
  for (let s = 0; s < n * OS + TAPS; s += CHUNK) {
    for (const b of bus) b.fill(0)
    for (const v of voices) {
      const [gl, gr, gs] = v.gain
      v.fill(one, s)
      for (let j = 0; j < CHUNK; j++) {
        bus[0][j] += one[j] * gl
        bus[1][j] += one[j] * gr
        bus[2][j] += one[j] * gl * gs
        bus[3][j] += one[j] * gr * gs
      }
    }
    down.forEach((d, i) => d(bus[i], s / OS))
  }
  for (let i = D; i < n; i++) {
    const a = echo[1] * er[i - D], b = echo[1] * el[i - D]
    l[i] += a
    r[i] += b
    el[i] += a
    er[i] += b
  }
  const [pl, sl] = master(l, fade * SR, tone), [pr, sr] = master(r, fade * SR, tone)
  return { l, r, peak: Math.max(pl, pr), rms: Math.sqrt((sl + sr) / n / 2) }
}

export function wav(chans, gain) {
  const n = chans[0].length, c = chans.length, b = Buffer.alloc(44 + n * c * 2)
  b.write('RIFF')
  b.writeUInt32LE(36 + n * c * 2, 4)
  b.write('WAVEfmt ', 8)
  b.writeUInt32LE(16, 16)
  b.writeUInt16LE(1, 20)
  b.writeUInt16LE(c, 22)
  b.writeUInt32LE(SR, 24)
  b.writeUInt32LE(SR * c * 2, 28)
  b.writeUInt16LE(c * 2, 32)
  b.writeUInt16LE(16, 34)
  b.write('data', 36)
  b.writeUInt32LE(n * c * 2, 40)
  for (let i = 0; i < n; i++) for (let j = 0; j < c; j++)
    b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(chans[j][i] * gain * 32767 + Math.random() - Math.random()))), 44 + (i * c + j) * 2)
  return b
}
