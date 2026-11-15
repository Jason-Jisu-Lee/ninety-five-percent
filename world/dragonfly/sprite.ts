import { u32 } from '../../core/canvas'
import { pixels } from '../../core/pixels'
import { DF, GROW, JAW, WING } from '../../data/dragonfly'
import type { Look } from './look'

type Pt = number[]

const mix = (a: Pt, b: Pt, t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const gap = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1])

export const size = (K: number) => 2 * Math.ceil(K * 13.2) + 1

export function sprite(a: number, phF: number, phH: number, col: Look, lift: number, grab: boolean, K: number, still = false) {
  const S = size(K), c = S / 2, p = pixels(S, S), body = new Uint8Array(S * S), cover = new Uint8Array(S * S)
  const [fast, bite] = col.st, ca = Math.cos(a), sa = Math.sin(a)
  const T = (x: number, y: number, z = 0) => [c + K * (x * ca - y * sa), c + K * (x * sa + y * ca - z * lift)]
  const put = ([x, y]: Pt, hex: string, bit: number, solid = 0) => {
    const ix = Math.floor(x), iy = Math.floor(y), i = iy * S + ix
    if (ix < 0 || iy < 0 || ix >= S || iy >= S) return
    p.u[i] = u32(hex)
    cover[i] |= bit
    body[i] = solid
  }
  const line = (pts: Pt[], hex: string, bit: number) => {
    for (let k = 0; k < pts.length - 1; k++) {
      const n = Math.ceil(gap(pts[k], pts[k + 1]) * 2) || 1
      for (let j = 0; j <= n; j++) put(mix(pts[k], pts[k + 1], j / n), hex, bit)
    }
  }
  if (grab) for (const s of [-1, 1]) for (const leg of DF.legs) line(leg.map(([x, y]) => T(x * s, y)), col.tip, 2)
  for (const kind of ['hind', 'fore'] as const) for (const s of [-1, 1]) {
    const w = DF[kind], ph = kind === 'fore' ? phF : phH, dx = s * Math.cos(w.sweep), dy = Math.sin(w.sweep), flip = dx > 0 ? -1 : 1
    const nx = -dy * flip, ny = dx * flip, span = Math.cos(ph), rise = Math.sin(ph), lead: Pt[] = [], trail: Pt[] = []
    for (let k = 0; k <= 8; k++) {
      const u = k / 8, bx = s * .7 + dx * w.L * u * span, by = w.ry + dy * w.L * u * span, z = w.L * u * rise
      const cw = kind === 'fore'
        ? w.chord * Math.pow(Math.sin(Math.PI * (.08 + .92 * u)), .55) + .2
        : w.chord * Math.pow(Math.sin(Math.PI * (.3 + .7 * u)), .6) * (1 - .25 * u) + .2
      lead.push(T(bx + nx * cw * .3, by + ny * cw * .3, z))
      trail.push(T(bx - nx * cw * .7, by - ny * cw * .7, z))
    }
    for (let k = 0; k < 8; k++) for (let i = 0, n = Math.ceil(Math.max(gap(lead[k], lead[k + 1]), gap(trail[k], trail[k + 1])) * 2) || 1; i < n; i++) {
      const f = i / n, A = mix(lead[k], lead[k + 1], f), Z = mix(trail[k], trail[k + 1], f), u = (k + f) / 8
      for (let j = 0, m = Math.ceil(gap(A, Z) * 2) || 1; j <= m; j++) put(mix(A, Z, j / m), u < .1 || still && j / m > .5 && u * w.L * .7 % 1 < .2 ? col.vein : col.fill, 1)
    }
    line(lead.map((q, k) => mix(q, trail[k], .42)), col.vein, 1)
    line(trail, col.vein, 1)
    line(lead, WING.costa, 1)
    if (still) put(mix(lead[4], trail[4], .25), WING.costa, 1)
    for (const d of [0, .2]) line([mix(mix(lead[6], lead[7], .5), mix(trail[6], trail[7], .5), d), mix(lead[7], trail[7], d)], WING.stigma, 1)
  }
  const B = DF.abdomen, TH = DF.thorax, HD = DF.head, E = DF.eyes, J = DF.jaw, side = ca * -.6 + sa * -.8, end = B.to + GROW.tail * fast
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const sx = x + .5 - c, sy = y + .5 - c, bx = (sx * ca + sy * sa) / K, by = (-sx * sa + sy * ca) / K, ax = Math.abs(bx)
    if (((ax - E.x) / E.rx) ** 2 + ((by - E.y) / E.ry) ** 2 <= 1) put([x, y], col.eye, 2, 1)
    else if ((bx / HD.rx) ** 2 + ((by - HD.y) / HD.ry) ** 2 <= 1) put([x, y], col.head, 2, 1)
    else if ((bx / TH.rx) ** 2 + (by / TH.ry) ** 2 <= 1) {
      const l = (sx * -.6 + sy * -.8) / (1.6 * K)
      put([x, y], l > .45 ? col.thoraxHi : l < -.5 ? col.thoraxDk : col.thorax, 2, 1)
    } else if (by >= B.from && by <= end) {
      const hw = by < B.from + 1.6 ? B.baseWidth : B.width
      if (ax > hw) continue
      put([x, y], (by - B.from) / (end - B.from) > .88 ? col.tip : (by - B.from) % B.band / B.band < .28 ? col.abdDk : bx * side / hw > .35 ? col.thoraxHi : col.abd, 2, 1)
    }
  }
  const ring: number[] = []
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const i = y * S + x
    if (!body[i] && (x > 0 && body[i - 1] || x < S - 1 && body[i + 1] || y > 0 && body[i - S] || y < S - 1 && body[i + S])) ring.push(i)
  }
  for (const i of ring) put([i % S, i / S | 0], WING.outline, 2)
  for (const s of [-1, 1]) {
    const jx = J.x + .04 * bite, len = .1 + GROW.jaw * bite, tip = T(s * jx * (bite > 1 ? .25 : .4), J.y - len)
    if (bite) line(bite > 1 ? [T(s * jx, J.y), T(s * (jx + .12), J.y - len * .55), tip] : [T(s * jx, J.y), tip], JAW, 0)
    if (bite > 2) put(tip, WING.sheen, 0)
    if (fast) line([T(s * .2, end), T(s * (.2 + .28 * fast), end + GROW.fork * fast)], col.tip, 2)
    put(T(s * E.x - .2 * (ca + sa), E.y - .2 * (ca - sa)), WING.fill, 0)
  }
  return { p, cover }
}
