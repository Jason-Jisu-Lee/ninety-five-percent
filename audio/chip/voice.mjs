import { DUTY, FS, RELEASE, STEP, TAU, VIB, WAVES } from './tables.mjs'

function noise(e, tt, out, a, b, st) {
  const [bits, f0, f1, ft, v, d] = e.hit
  const amp = Math.max(0, Math.ceil(v * e.v / 15 * (1 - tt / d))) / 15, inc = (f1 + (f0 - f1) * Math.exp(-tt / ft)) / FS
  for (let j = a; j < b; j++) {
    let rem = 1, acc = 0
    while (st.ph + rem * inc >= 1) {
      const dt = (1 - st.ph) / inc, bit = (st.reg ^ st.reg >> 1) & 1
      acc += st.bit * dt
      rem -= dt
      st.ph = 0
      st.reg = st.reg >> 1 | bit << 14
      if (bits === 7) st.reg = st.reg & ~64 | bit << 6
      st.bit = st.reg & 1 ? -.5 : .5
    }
    acc += st.bit * rem
    st.ph += rem * inc
    out[j] = acc * amp
  }
}

function tone(kind, e, tt, tail, inc, out, a, b, st) {
  if (kind === 't' || kind === 's') {
    const amp = e.v / 30 * tail * (kind === 't' ? Math.min(1, tt / .004) * Math.exp(-tt / e.tau)
      : e.x ? Math.min(1, tt / (e.x * .012)) : tt < e.rise ? tt / e.rise : Math.exp(-4.6 * (tt - e.rise) / (e.len - e.rise)))
    for (let j = a; j < b; j++) {
      if ((st.ph += inc) >= 1) st.ph--
      out[j] = (kind === 's' ? Math.sin(TAU * st.ph) : 1 - 4 * Math.abs((st.ph + .25) % 1 - .5)) * amp
    }
    return
  }
  const d = DUTY[e.duty], tab = kind === 'w' && WAVES[e.duty % 4][Math.max(0, Math.min(3, e.v))]
  const amp = (tab ? 1 / 32 : (e.x ? Math.max(0, e.v - (tt * 64 / e.x | 0)) : e.v) / 15) * tail
  const G = tab
    ? u => {
      const x = u * 32, n = x | 0
      return tab.cum[n] + (x - n) * tab.smp[n]
    }
    : u => u < d ? u * (1 - d) : d * (1 - u)
  let g0 = G(st.ph)
  for (let j = a; j < b; j++) {
    if ((st.ph += inc) >= 1) st.ph--
    const g1 = G(st.ph)
    out[j] = (g1 - g0) / inc * amp
    g0 = g1
  }
}

export function voice(kind, list) {
  const st = { ph: 0, reg: 0x7fff, bit: .5 }
  let i = 0, on
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
        st.reg = 0x7fff
        if (kind !== 'p') st.ph = 0
      }
      for (const stop = Math.min(end, e.s1); s < stop;) {
        const m = Math.min(stop, s + STEP), tt = (s - e.s0) / FS
        if (kind === 'n') noise(e, tt, out, s - s0, m - s0, st)
        else {
          const note = e.m.length ? e.m[(tt * 40 | 0) % e.m.length] : e.m, vb = VIB[e.vib]
          let f = 440 * 2 ** ((note - 69 + e.sw * tt / e.len) / 12)
          if (vb && tt > vb[0]) f *= 2 ** (vb[1] / 1200 * Math.sin(TAU * vb[2] * (tt - vb[0])))
          tone(kind, e, tt, Math.min(1, (e.s1 - s) / RELEASE), f / FS, out, s - s0, m - s0, st)
        }
        s = m
      }
    }
  }
}
