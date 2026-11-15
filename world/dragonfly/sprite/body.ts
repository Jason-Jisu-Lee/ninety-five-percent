import { DF, GROW, LEAN } from '../../../data/dragonfly/body'
import { JAW, WING } from '../../../data/dragonfly/colors'
import type { Look } from './look'
import type { Place, Raster } from './raster'

export function body({ S, body: solid, put, line }: Raster, T: Place, col: Look, a: number, K: number, lean: number) {
  const B = DF.abdomen, TH = DF.thorax, HD = DF.head, E = DF.eyes, J = DF.jaw, [fast, bite] = col.st, c = S / 2
  const ca = Math.cos(a), sa = Math.sin(a), side = ca * -.6 + sa * -.8, end = B.to + GROW.tail * fast
  const bow = (by: number) => -lean * LEAN.sway * ((by - B.from) / (end - B.from)) ** 2
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const sx = x + .5 - c, sy = y + .5 - c, bx = (sx * ca + sy * sa) / K, by = (-sx * sa + sy * ca) / K, ax = Math.abs(bx)
    if (((ax - E.x) / E.rx) ** 2 + ((by - E.y) / E.ry) ** 2 <= 1) put([x, y], col.eye, 2, 1)
    else if ((bx / HD.rx) ** 2 + ((by - HD.y) / HD.ry) ** 2 <= 1) put([x, y], col.head, 2, 1)
    else if ((bx / TH.rx) ** 2 + (by / TH.ry) ** 2 <= 1) {
      const l = (sx * -.6 + sy * -.8) / (1.6 * K)
      put([x, y], l > .45 ? col.thoraxHi : l < -.5 ? col.thoraxDk : col.thorax, 2, 1)
    } else if (by >= B.from && by <= end) {
      const hw = by < B.from + 1.6 ? B.baseWidth : B.width, off = bx - bow(by), u = (by - B.from) / (end - B.from)
      if (Math.abs(off) > hw) continue
      put([x, y], u > .88 ? col.tip : (by - B.from) % B.band / B.band < .28 ? col.abdDk : off * side / hw > .35 ? col.thoraxHi : col.abd, 2, 1)
    }
  }
  const ring: number[] = []
  for (let i = 0; i < S * S; i++) {
    const x = i % S
    if (!solid[i] && (x > 0 && solid[i - 1] || x < S - 1 && solid[i + 1] || solid[i - S] || solid[i + S])) ring.push(i)
  }
  for (const i of ring) put([i % S, i / S | 0], WING.outline, 2)
  for (const s of [-1, 1]) {
    const jx = J.x + .04 * bite, len = .1 + GROW.jaw * bite, tip = T(s * jx * (bite > 1 ? .25 : .4), J.y - len)
    if (bite) line(bite > 1 ? [T(s * jx, J.y), T(s * (jx + .12), J.y - len * .55), tip] : [T(s * jx, J.y), tip], JAW, 0)
    if (bite > 2) put(tip, WING.sheen, 0)
    if (fast) line([T(s * .2 + bow(end), end), T(s * (.2 + .28 * fast) + bow(end), end + GROW.fork * fast)], col.tip, 2)
    put(T(s * E.x - .2 * (ca + sa), E.y - .2 * (ca - sa)), WING.fill, 0)
  }
}
