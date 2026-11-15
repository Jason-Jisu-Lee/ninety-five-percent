import { DF, LEAN } from '../../../data/dragonfly/body'
import { WING } from '../../../data/dragonfly/colors'
import type { Look } from './look'
import { gap, mix, type Place, type Pt, type Raster } from './raster'

export function wings({ put, line }: Raster, T: Place, col: Look, phF: number, phH: number, lean: number, still: boolean) {
  for (const kind of ['hind', 'fore'] as const) for (const s of [-1, 1]) {
    const w = DF[kind], L = w.L * (1 - LEAN.bank * Math.max(0, lean * s)), ph = kind === 'fore' ? phF : phH
    const dx = s * Math.cos(w.sweep), dy = Math.sin(w.sweep), flip = dx > 0 ? -1 : 1, nx = -dy * flip, ny = dx * flip
    const span = Math.cos(ph), rise = Math.sin(ph), lead: Pt[] = [], trail: Pt[] = []
    for (let k = 0; k <= 8; k++) {
      const u = k / 8, bx = s * .7 + dx * L * u * span, by = w.ry + dy * L * u * span, z = L * u * rise
      const cw = kind === 'fore'
        ? w.chord * Math.pow(Math.sin(Math.PI * (.08 + .92 * u)), .55) + .2
        : w.chord * Math.pow(Math.sin(Math.PI * (.3 + .7 * u)), .6) * (1 - .25 * u) + .2
      lead.push(T(bx + nx * cw * .3, by + ny * cw * .3, z))
      trail.push(T(bx - nx * cw * .7, by - ny * cw * .7, z))
    }
    for (let k = 0; k < 8; k++) {
      const n = Math.ceil(Math.max(gap(lead[k], lead[k + 1]), gap(trail[k], trail[k + 1])) * 2) || 1
      for (let i = 0; i < n; i++) {
        const f = i / n, A = mix(lead[k], lead[k + 1], f), Z = mix(trail[k], trail[k + 1], f), u = (k + f) / 8, m = Math.ceil(gap(A, Z) * 2) || 1
        for (let j = 0; j <= m; j++) put(mix(A, Z, j / m), u < .1 || still && j / m > .5 && u * w.L * .7 % 1 < .2 ? col.vein : col.fill, 1)
      }
    }
    line(lead.map((q, k) => mix(q, trail[k], .42)), col.vein, 1)
    line(trail, col.vein, 1)
    line(lead, WING.costa, 1)
    if (still) put(mix(lead[4], trail[4], .25), WING.costa, 1)
    for (const d of [0, .2]) line([mix(mix(lead[6], lead[7], .5), mix(trail[6], trail[7], .5), d), mix(lead[7], trail[7], d)], WING.stigma, 1)
  }
}
