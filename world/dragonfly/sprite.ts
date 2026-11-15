import { u32 } from '../../core/canvas'
import { pixels } from '../../core/pixels'
import { BODY, DF, JAW, WING } from '../../data/dragonfly'

type Pt = number[]

const mix = (a: Pt, b: Pt, t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

function inPoly(x: number, y: number, poly: Pt[]) {
  let ins = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins
  }
  return ins
}

export const size = (K: number) => 2 * Math.ceil(K * 11.4) + 1

export function sprite(a: number, phF: number, phH: number, col: typeof BODY.blue, lift: number, grab: boolean, K: number) {
  const S = size(K), c = S / 2, p = pixels(S, S), body = new Uint8Array(S * S), cover = new Uint8Array(S * S)
  const ca = Math.cos(a), sa = Math.sin(a)
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
      const n = Math.ceil(Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]) * 2) || 1
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
    const poly = [...lead, ...trail.slice().reverse()], xs = poly.map(q => q[0]), ys = poly.map(q => q[1])
    const x0 = Math.floor(Math.min(...xs)), x1 = Math.ceil(Math.max(...xs)), y1 = Math.ceil(Math.max(...ys))
    for (let y = Math.floor(Math.min(...ys)); y <= y1; y++) for (let x = x0; x <= x1; x++) if (inPoly(x + .5, y + .5, poly)) put([x, y], WING.fill, 1)
    line(lead.map((q, k) => mix(q, trail[k], .42)), WING.vein, 1)
    line(lead, WING.costa, 1)
    for (const d of [0, .2]) line([mix(mix(lead[6], lead[7], .5), mix(trail[6], trail[7], .5), d), mix(lead[7], trail[7], d)], WING.stigma, 1)
  }
  const B = DF.abdomen, TH = DF.thorax, HD = DF.head, E = DF.eyes, J = DF.jaw, side = ca * -.6 + sa * -.8
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const sx = x + .5 - c, sy = y + .5 - c, bx = (sx * ca + sy * sa) / K, by = (-sx * sa + sy * ca) / K
    if (((Math.abs(bx) - E.x) / E.rx) ** 2 + ((by - E.y) / E.ry) ** 2 <= 1) put([x, y], col.eye, 2, 1)
    else if ((bx / HD.rx) ** 2 + ((by - HD.y) / HD.ry) ** 2 <= 1) put([x, y], col.head, 2, 1)
    else if ((bx / TH.rx) ** 2 + (by / TH.ry) ** 2 <= 1) {
      const l = (sx * -.6 + sy * -.8) / (1.6 * K)
      put([x, y], l > .45 ? col.thoraxHi : l < -.5 ? col.thoraxDk : col.thorax, 2, 1)
    } else if (by >= B.from && by <= B.to) {
      const hw = by < B.from + 1.6 ? B.baseWidth : B.width
      if (Math.abs(bx) > hw) continue
      put([x, y], (by - B.from) / (B.to - B.from) > .88 ? col.tip : (by - B.from) % B.band / B.band < .28 ? col.abdDk : bx * side / hw > .35 ? col.thoraxHi : col.abd, 2, 1)
    }
  }
  const ring: number[] = []
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const i = y * S + x
    if (!body[i] && (x > 0 && body[i - 1] || x < S - 1 && body[i + 1] || y > 0 && body[i - S] || y < S - 1 && body[i + S])) ring.push(i)
  }
  for (const i of ring) put([i % S, i / S | 0], WING.outline, 2)
  for (const s of [-1, 1]) {
    line([T(s * J.x, J.y), T(s * J.x * .4, J.y - J.len)], JAW, 0)
    put(T(s * E.x - .2 * (ca + sa), E.y - .2 * (ca - sa)), WING.fill, 0)
  }
  return { p, cover }
}
