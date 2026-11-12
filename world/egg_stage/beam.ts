import { u32, type Ctx } from '../../core/canvas'
import { bayer } from '../../core/dither'
import { once } from '../../core/once'
import { pixels } from '../../core/pixels'
import { UI } from '../../data/palette'
import { H } from '../../data/screen'

const BW = 600
const rays = once(() => {
  const p = pixels(BW, H), col = (u32(UI.glint) & 0xffffff | 90 << 24) >>> 0
  for (let y = 14; y < H; y++) for (let x = 0; x < BW; x++) {
    const u = ((x + y * .45) % 150 + 150) % 150
    if (u <= 30 && bayer(x, y) < (1 - Math.abs(u - 15) / 15) * (1 - y / H) * .5) p.u[y * BW + x] = col
  }
  return p.done()
})

export function beam(g: Ctx, t: number) {
  g.imageSmoothingEnabled = true
  g.drawImage(rays(), -60 + Math.sin(t * .25) * 30, 0)
}
