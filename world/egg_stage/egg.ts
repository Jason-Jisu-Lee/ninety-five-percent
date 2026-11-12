import { bayer } from '../../core/dither'
import { pixels } from '../../core/pixels'
import { EGG } from '../../data/egg'

const SHELL = ['#9c8a6c', '#b8a888', '#cfc2a6', '#e0d6c0', '#ece5d5', '#f8f3e8']
const cache: HTMLCanvasElement[] = []

export function egg(breathing: boolean) {
  return cache[+breathing] ??= (() => {
    const p = pixels(60, 90), lift = breathing ? .35 : 0
    for (let y = 0; y < 90; y++) for (let x = 0; x < 60; x++) {
      const nx = (x - 30) / EGG.rx, ny = (y - 45) / EGG.ry, e = nx * nx + ny * ny
      if (e > 1) continue
      const lam = .55 * (-.6 * nx - .8 * ny) + .6 * Math.sqrt(Math.max(0, 1 - e))
      p.set(x, y, ((nx + .42) / .09) ** 2 + ((ny + .52) / .11) ** 2 <= 1 ? '#fffbf2'
        : e > .9 && nx * .6 + ny * .8 > .05 ? '#6e5e46'
        : SHELL[Math.max(0, Math.min(5, Math.floor(lam * 5 + bayer(x, y) * .9 + lift)))])
    }
    return p.done()
  })()
}
