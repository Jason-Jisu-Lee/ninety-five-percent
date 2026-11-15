import { master, shrink, taps } from './filter.mjs'
import { parse } from './mml.mjs'
import { CHUNK, FS, HITS, KIND, MIX, OS, SR, TAPS } from './tables.mjs'
import { voice } from './voice.mjs'

function events(key, mml, at, [late, loud], rand) {
  const kind = KIND[key[0]], lanes = [[], [], [], []]
  let turn = 0
  for (const n of parse(mml, kind === 'n').notes) {
    const nudge = (rand() - .5) * 2 * late * FS | 0, s0 = Math.max(0, Math.round(at(n.t) * FS) + nudge), off = Math.round(at(n.t + n.d * n.q / 8) * FS) + nudge
    const hit = HITS[n.m], tau = (n.x || 3) * .07, v = kind === 'w' ? n.v : Math.max(1, n.v + Math.round((rand() - .5) * 2 * loud))
    if (kind === 'n' && !hit) throw Error(`no drum "${n.m}"`)
    if (kind === 't' || kind === 's') [n.m].flat().forEach((m, c) => lanes[kind === 't' ? turn++ % 4 : c % 4].push({ ...n, v, m, s0, s1: kind === 't' ? s0 + tau * 7 * FS | 0 : off, tau }))
    else lanes[0].push({ ...n, v, s0, s1: kind === 'n' ? s0 + hit[5] * FS | 0 : off, hit })
  }
  for (const list of lanes) list.forEach((e, j) => {
    if (list[j + 1]) e.s1 = Math.min(e.s1, list[j + 1].s0)
    e.len = (e.s1 - e.s0) / FS
    e.rise = Math.min(e.len * .35, 1.2)
  })
  return lanes.filter(l => l.length).map(list => ({ kind, list }))
}

export function render({ bpm, swing = .5, echo = [.75, .35], send = {}, tone = 5800, ring = 0, feel = [0, 0] }, src, seconds, fade = .005) {
  const at = t => {
    const b = t / 48, w = b % 1
    return (b - w + (w < .5 ? w * 2 * swing : swing + (w - .5) * 2 * (1 - swing))) * 60 / bpm
  }
  let seed = bpm * 7919 | 0
  const rand = () => (seed = seed * 1664525 + 1013904223 >>> 0) / 4294967296
  const voices = Object.entries(src).flatMap(([key, mml]) => events(key, mml, at, feel, rand).map(({ kind, list }) =>
    ({ last: list[list.length - 1].s1, gain: [MIX[key[0]][0], MIX[key[0]][1], send[key] ?? MIX[key[0]][2]], fill: voice(kind, list) })))
  const n = Math.ceil((seconds ?? Math.max(...voices.map(v => v.last)) / FS + .03 + ring) * SR), outs = [0, 1, 2, 3].map(() => new Float32Array(n)), [l, r, el, er] = outs
  const one = new Float64Array(CHUNK), bus = outs.map(() => new Float64Array(CHUNK)), h = taps(), down = outs.map(o => shrink(h, o)), D = Math.round(echo[0] * 60 / bpm * SR)
  for (let s = 0; s < n * OS + TAPS; s += CHUNK) {
    for (const b of bus) b.fill(0)
    for (const { gain: [gl, gr, gs], fill } of voices) {
      fill(one, s)
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
