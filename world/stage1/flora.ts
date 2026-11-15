import { dither } from '../../core/dither'
import type { Pixels } from '../../core/pixels'
import { FOREST as C } from '../../data/palette'
import { shade } from './shade'
import { stroke } from './stroke'

export function clover(p: Pixels, x: number, y: number, R: () => number, n: number) {
  const spots = Array.from({ length: n }, () => [x + (R() - .5) * 50, y + (R() - .5) * 28, 4 + R() * 1.5, R() * 6.283]).sort((a, b) => a[1] - b[1])
  for (const [cx, cy, r, rot] of spots) {
    for (let k = 0; k < 3; k++) {
      const a = rot + k * 2.094, ax = Math.cos(a), ay = Math.sin(a)
      p.oval(cx + ax * r * .9, cy + ay * r * .8, r, r * .85, (px, py, d) =>
        d > .68 ? C.cDark : Math.abs(d - .28) < .12 && (px - cx) * ax + (py - cy) * ay > r * .95 ? C.g3 : C.cLight)
    }
    p.set(Math.round(cx), Math.round(cy), C.cDark)
  }
}

export function daisy(p: Pixels, x: number, y: number, rot: number) {
  const r = 9.5, cy = y - 5
  shade(p, x + 6, y + 6, r, r * .55)
  p.oval(x, cy, r, r * .9, (px, py) => {
    const dx = px - x, dy = (py - cy) / .9, rr = Math.hypot(dx, dy) / r, m = Math.abs(Math.sin(Math.atan2(dy, dx) * 6.5 + rot))
    return rr < .3 ? (dx + dy > 1.5 ? C.seed : C.yellow) : rr > .6 + .4 * m ? false : m < .3 && rr > .45 ? C.r2 : C.white
  })
}

export function dandelion(p: Pixels, x: number, y: number, R: () => number) {
  for (let i = 0; i < 7; i++) {
    const a = (i + R() * .6) / 7 * 6.283
    stroke(p, x, y, a, (26 + R() * 10) * (.75 - .25 * Math.sin(a)), (R() - .5) * 8,
      u => 1 + 4.5 * Math.sin(Math.PI * (.12 + u * .88)) * (.72 + .28 * Math.cos(u * 30)),
      s => Math.abs(s) < .2 ? C.g3 : s > .5 ? C.cDark : C.cLight)
  }
  shade(p, x + 6, y + 5, 11, 7)
  p.oval(x, y - 7, 10.5, 9.5, (px, py, d) => {
    const a = Math.atan2(py - y + 7, px - x), rr = Math.sqrt(d)
    return rr > .8 + .2 * Math.abs(Math.sin(a * 11)) ? false : rr < .36 ? (dither(px, py, .5) ? C.seed : C.yellow) : Math.sin(a * 23) > .8 && rr > .55 ? C.seed : C.yellow
  })
}
