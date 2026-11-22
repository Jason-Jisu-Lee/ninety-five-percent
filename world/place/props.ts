import { BLOOM } from './blooms'
import type { Base } from './kit'
import { blades, pool, TUFT } from './reeds'
import { log, SNAG, STONE } from './rocks'

const PATCH = [[0, 0], [15, -6], [-14, -4], [8, 9], [-9, 11], [25, 5], [-26, 7], [3, -15], [31, -10], [-31, -8]]
const ROCKS = [[0, 0, 0], [22, 8, 1], [-18, 10, 1], [10, 16, 2], [-8, -9, 2], [30, -2, 2]]

export function props({ R, b, k, pick, sprite, queue, dry, cover, flowers, sites, perches, swarms, zone }: Base) {
  return {
    tuft(x: number, y: number, flip = R() < .5) {
      cover.push([x, y - 3])
      queue(y, () => {
        for (let i = -4; i < 6; i++) b.dim(x + i, y + 1)
        blades(b, pick(TUFT), x, y, k, flip)
      })
    },
    blooms(x: number, y: number, n: number, kinds: number[]) {
      const flip = R() < .5 ? -1 : 1
      PATCH.slice(0, n).forEach(([dx, dy], i) => {
        const art = BLOOM[kinds[i % kinds.length]], bx = x + dx * flip, by = y + dy
        if (!dry(bx, by, 6)) return
        sprite(art, bx - (art[0].length >> 1), by - art.length, R() < .5, k, 1)
        flowers.push([bx, by - art.length + 3])
      })
      zone('flowers', x, y - 8, n > 5 ? 40 : 26, n > 3 ? 22 : 16)
    },
    stones(x: number, y: number, n: number) {
      ROCKS.slice(0, n).forEach(([dx, dy, s]) => {
        const art = STONE[s], sx = x + dx - (art[0].length >> 1), sy = y + dy - art.length
        sprite(art, sx, sy, R() < .5, k, s < 2 ? 3 : 1)
        if (s > 1) return
        sites.push([x + dx, sy + 4])
        perches.push({ x: x + dx, y: sy + 5, h: 2 })
      })
      zone('stones', x + 4, y - 2, 30, 20)
    },
    log(x: number, y: number, len: number, every: number) {
      const at = (i: number) => y + (every ? Math.floor(i / every) : 0)
      queue(y + 9, () => log(b, x, y, len, every, k))
      for (const u of [.25, .7]) {
        const i = Math.round(len * u)
        sites.push([x + i, at(i) + 2])
        perches.push({ x: x + i, y: at(i) + 3, h: 3 })
      }
      swarms.push([x + len / 2, y - 6])
      zone('log', x + len / 2, y + 4 + (every ? len / every / 2 : 0), len / 2 + 6, 14)
    },
    snag(x: number, y: number) {
      queue(y, () => pool(b, x, y - 2, 9))
      sprite(SNAG, x - 10, y - SNAG.length, R() < .5, k, 0)
      perches.push({ x, y, h: (SNAG.length - 2) / .7 })
      sites.push([x, y - 8])
      zone('log', x, y - 8, 18, 16)
    },
  }
}
