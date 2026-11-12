import { bayer } from '../../core/dither'
import { once } from '../../core/once'
import { pixels } from '../../core/pixels'
import { rng } from '../../core/rng'
import { H, W } from '../../data/screen'
import { leaf } from './leaf'

const SILT = ['#132a29', '#17302f', '#1b3836', '#21413e', '#284a45', '#2f5450']
const WEEDS = [[0, 40, .25, .006, 150], [480, 232, 3.35, -.004, 170], [472, 8, 2.35, .008, 110], [8, 268, -.95, .005, 120], [150, 270, -1.4, .01, 70]]

export const lakebed = once(() => {
  const p = pixels(W, H), r = rng(7)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const n = Math.sin(x * .031 + 1.3) * Math.sin(y * .043 + .4) + .5 * Math.sin(x * .11 + y * .07) + .3 * Math.sin(x * .23 - y * .19)
    const l = 1 - (x / W * .55 + y / H * .45)
    p.set(x, y, SILT[Math.max(0, Math.min(5, Math.floor(n * .6 + l * 3.4 + bayer(x, y))))])
  }
  for (let k = 0; k < 55; k++) {
    const cx = Math.floor(r() * W), cy = Math.floor(r() * H), rx = 1.5 + r() * 2.5, ry = 1 + r() * 2
    const stone = (fn: (dx: number, dy: number) => void) => {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -5; dx <= 5; dx++) if ((dx / rx) ** 2 + (dy / ry) ** 2 <= 1) fn(dx, dy)
    }
    stone((dx, dy) => p.set(cx + dx + 1, cy + dy + 1, '#10221f'))
    stone((dx, dy) => {
      const s = -(dx / rx + dy / ry)
      p.set(cx + dx, cy + dy, s > .8 ? '#4a6e68' : s < -.8 ? '#1b3836' : '#33504b')
    })
  }
  for (const [x0, y0, a0, curl, len] of WEEDS) {
    let X = x0, Y = y0, a = a0
    for (let s = 0; s < len; s++) {
      X += Math.cos(a)
      Y += Math.sin(a)
      a += curl
      const ix = Math.round(X), iy = Math.round(Y)
      p.dark(ix + 2, iy + 2, .7)
      p.set(ix, iy, '#1c4730')
      p.set(ix + 1, iy, '#1c4730')
      if (s % 3 === 0) p.set(ix, iy - 1, '#285e3c')
      if (s % 12 !== 6) continue
      const b = a + (s % 24 < 12 ? .9 : -.9)
      for (let q = 1; q < 6; q++) p.set(Math.round(X + Math.cos(b) * q), Math.round(Y + Math.sin(b) * q), q < 3 ? '#1c4730' : '#285e3c')
    }
  }
  leaf(p)
  return p.done()
})
