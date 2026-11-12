import { bayer } from '../../core/dither'
import { once } from '../../core/once'
import { pixels } from '../../core/pixels'
import { rng } from '../../core/rng'
import { EGG } from '../../data/egg'
import { H, W } from '../../data/screen'
import { FLOOR, gnd, rdg } from './terrain'

const WATER = ['#3b7175', '#336670', '#2d5c63', '#28525c', '#24495a', '#203f52', '#1c3a4c']
const MUD = ['#2f3a2d', '#28322a', '#212a24', '#1b231f']
const STEMS = [[10, 40, 3], [24, 95, 2]], PEBBLES = [[160, 3], [236, 2], [252, 1.5], [128, 1.5]]
const step = (v: number, max: number) => Math.max(0, Math.min(max, Math.floor(v)))

export const backdrop = once(() => {
  const p = pixels(W, H), r = rng(9)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const bd = bayer(x, y), g = gnd(x), rd = rdg(x)
    p.set(x, y, y < 12 ? (bd < .5 ? '#16302f' : '#1a3836')
      : y < rd ? WATER[step((y - 12) / (g - 12) * 6.2 + bd, 6)]
      : y < g ? (y === rd ? '#2c5459' : bd < .5 ? '#22464d' : '#204049')
      : y === g ? '#4a5640' : MUD[step((y - g) / 9 + bd, 3)])
  }
  for (let k = 0; k < 9; k++) {
    let X = 20 + r() * 360, Y = rdg(Math.round(X)), a = -Math.PI / 2 + (r() - .5) * .3
    const h = 70 + r() * 90
    for (let s = 0; s < h; s++) {
      X += Math.cos(a)
      Y += Math.sin(a)
      a += Math.sin(s * .05 + k) * .012
      const ix = Math.round(X), iy = Math.round(Y)
      if (iy >= rdg(ix)) continue
      p.set(ix, iy, '#21454e')
      if (s % 26 !== 13) continue
      const dir = s % 52 < 26 ? -1 : 1
      for (let q = 1; q < 9; q++) {
        const lx = ix + dir * q, ly = iy - Math.round(q * .8)
        if (ly < rdg(lx)) p.set(lx, ly, '#21454e')
      }
    }
  }
  for (const [sx, top, w] of STEMS) {
    for (let y = gnd(sx); y > top; y--) {
      const x = Math.round(sx + Math.sin(y * .02) * 3)
      for (let i = 0; i < w; i++) p.set(x + i, y, i ? '#0e2024' : '#183234')
    }
    for (let q = 0; q < 46; q++) for (const i of [0, 1]) p.set(sx + 2 + Math.round(q * .55) + i, top + 30 + q, '#0e2024')
  }
  for (let dx = -31; dx <= 34; dx++) for (let dy = -2; dy <= 2; dy++) if ((dx / 32) ** 2 + (dy / 2.6) ** 2 <= 1) p.dark(EGG.x + 4 + dx, FLOOR + 1 + dy, .6)
  for (const [px, rr] of PEBBLES) {
    const py = gnd(px)
    for (let dy = -3; dy <= 1; dy++) for (let dx = -4; dx <= 4; dx++) {
      if ((dx / rr) ** 2 + (dy / (rr * .7)) ** 2 <= 1) p.set(px + dx, py + dy, dx + dy < -1 ? '#5a6650' : dx + dy > 1 ? '#232c25' : '#3c4838')
    }
  }
  return p.done()
})
