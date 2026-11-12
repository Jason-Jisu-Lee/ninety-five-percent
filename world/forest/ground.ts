import { dither } from '../../core/dither'
import { fbm } from '../../core/noise'
import { once } from '../../core/once'
import { pixels } from '../../core/pixels'
import { BUSHES, TREES } from '../../data/forest'
import { FOREST as C } from '../../data/palette'
import { H, W } from '../../data/screen'
import { decor } from './decor'
import { water } from './water'

export const ground = once(() => {
  const p = pixels(W, H), free = new Uint8Array(W * H)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const nl = fbm(x / 80, y / 80, 5), nd = fbm(x / 70 + 40, y / 70, 9)
    p.set(x, y, nl > .55 ? (dither(x, y, Math.min(.5, (nl - .55) * 5)) ? C.g2 : C.g1)
      : nd > .57 && dither(x, y, Math.min(.5, (nd - .57) * 5)) ? C.g0 : C.g1)
  }
  const shade = (cx: number, cy: number, rx: number, ry: number) => {
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
      if (d <= 1 && dither(x, y, d > .7 ? .25 : .5)) p.set(x, y, C.g0)
    }
  }
  for (const t of TREES) shade(t.x + t.r * .3, t.y + 3, t.r * .9, t.r * .36)
  for (const b of BUSHES) shade(b.x + b.r * .35, b.y + 1, b.r * .95, b.r * .4)
  water(p, free)
  decor(p, free)
  return { canvas: p.done(), free }
})
