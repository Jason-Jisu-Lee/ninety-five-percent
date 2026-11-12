import { u32 } from '../../core/canvas'
import { pixels } from '../../core/pixels'
import { BODY, DF, WING } from '../../data/dragonfly'

type Pt = number[]

function inPoly(x: number, y: number, poly: Pt[]) {
  let ins = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins
  }
  return ins
}

export function sprite(a: number, phF: number, phH: number, col: typeof BODY.blue, lift: number, outline: boolean) {
  const S = DF.S, c = S / 2, K = DF.scale, p = pixels(S, S), body = new Uint8Array(S * S), cover = new Uint8Array(S * S)
  const ca = Math.cos(a), sa = Math.sin(a)
  const T = (x: number, y: number, z = 0) => [c + K * (x * ca - y * sa), c + K * (x * sa + y * ca - z * lift)]
  const at = ([x, y]: Pt) => {
    const ix = Math.floor(x), iy = Math.floor(y)
    return ix < 0 || iy < 0 || ix >= S || iy >= S ? -1 : iy * S + ix
  }
  const wing = (i: number, hex: string) => {
    p.u[i] = u32(hex)
    cover[i] |= 1
  }
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
    const poly = [...lead, ...trail.slice().reverse()]
    let x0 = S, y0 = S, x1 = 0, y1 = 0
    for (const [x, y] of poly) {
      x0 = Math.min(x0, x)
      y0 = Math.min(y0, y)
      x1 = Math.max(x1, x)
      y1 = Math.max(y1, y)
    }
    for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(S - 1, Math.ceil(y1)); y++)
      for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(S - 1, Math.ceil(x1)); x++)
        if (inPoly(x + .5, y + .5, poly)) wing(y * S + x, WING.fill)
    for (let k = 0; k < lead.length - 1; k++) for (let t = 0; t < 1; t += .2) {
      const i = at([lead[k][0] + (lead[k + 1][0] - lead[k][0]) * t, lead[k][1] + (lead[k + 1][1] - lead[k][1]) * t])
      if (i >= 0) wing(i, WING.costa)
    }
    if (kind === 'fore' && at(lead[7]) >= 0) p.u[at(lead[7])] = u32(WING.stigma)
  }
  const solid = (i: number, hex: string) => {
    if (i < 0) return
    p.u[i] = u32(hex)
    body[i] = 1
    cover[i] |= 2
  }
  const B = DF.abdomen, TH = DF.thorax
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const sx = x + .5 - c, sy = y + .5 - c, bx = (sx * ca + sy * sa) / K, by = (-sx * sa + sy * ca) / K
    if ((bx / TH.rx) ** 2 + (by / TH.ry) ** 2 <= 1) {
      const l = (sx * -.6 + sy * -.8) / (1.6 * K)
      solid(y * S + x, l > .45 ? col.thoraxHi : l < -.5 ? col.thoraxDk : col.thorax)
    } else if (by >= B.from && by <= B.to && Math.abs(bx) <= (by < B.from + 1.6 ? B.baseWidth : B.width)) {
      solid(y * S + x, (by - B.from) / (B.to - B.from) > .88 ? col.tip : (by - B.from) % B.band / B.band < .28 ? col.abdDk : col.abd)
    }
  }
  solid(at(T(0, DF.head.y)), col.head)
  for (const s of [-1, 1]) solid(at(T(s * DF.eyes.x, DF.eyes.y)), col.eye)
  if (outline) {
    const ring: number[] = []
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const i = y * S + x
      if (!body[i] && (x > 0 && body[i - 1] || x < S - 1 && body[i + 1] || y > 0 && body[i - S] || y < S - 1 && body[i + S])) ring.push(i)
    }
    for (const i of ring) {
      p.u[i] = u32(WING.outline)
      cover[i] |= 2
    }
  }
  return { p, cover }
}
