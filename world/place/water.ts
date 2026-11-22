import type { Base } from './kit'
import { BUD, LILY, pad } from './pads'
import { blades, heads, pool, STAND } from './reeds'

const COLONY = [[0, 0, 22], [31, -7, 14], [-28, 9, 14], [9, 23, 12], [-16, -19, 8], [36, 11, 7], [-7, 27, 6], [-40, -4, 6]]

export function water({ R, b, k, S, sprite, queue, wet, sites, rafts, perches, swarms, zone }: Base, scale: number) {
  return {
    pads(x: number, y: number, n: number, lily = true) {
      const flip = R() < .5 ? -1 : 1, turn = R() * 8 | 0
      COLONY.slice(0, n).forEach(([dx, dy, r], i) => {
        const rx = Math.max(4, S(r)), rows = pad(rx, (turn + i * 3) % 8), cx = Math.round(x + dx * flip * scale), cy = Math.round(y + dy * scale), px = cx - rx, py = cy - rows.length / 2
        const bloom = lily && rx > 12 && (i === 0 || R() < .5)
        if (!wet(cx, cy, rx)) return
        sprite(rows, px, py, false, k, rx > 10 ? 3 : 2)
        if (rx > 7) sites.push([cx, cy]), rafts.push([cx, cy])
        if (bloom) queue(py + rows.length + 1, () => {
          const [lx, ly] = [cx - 7 + (i ? 0 : 5 * flip), cy - 9]
          b.cast(LILY, lx, ly, 2, 3)
          b.art(LILY, lx, ly, k)
        })
        else if (rx > 7) perches.push({ x: cx, y: cy + 1, h: 1 })
        if (!bloom && lily && rx > 7 && rx < 13 && R() < .5) sprite(BUD, cx + rx - 5, cy - rows.length / 2 - 1, false, k, 1)
      })
      zone('pads', x, y + S(2), S(46), S(34))
    },
    reeds(x: number, y: number, n: number, pond = true) {
      ;[0, -22, 20, -40, 38, -58, 56].slice(0, n).forEach((dx, i) => {
        const set = STAND[i ? 1 + (i + (R() * 2 | 0)) % 2 : 0], flip = R() < .5, bx = x + S(dx), by = y + (i % 2 ? 3 : 0), tops = heads(set, bx, by, flip, scale)
        if (i % 3 === 0 && tops.length) perches.push(tops.reduce((p, q) => q.h > p.h ? q : p))
        queue(by + 4, () => {
          if (pond) pool(b, bx, by, S(i ? 10 : 15))
          blades(b, set, bx, by, k, flip, scale)
        })
      })
      swarms.push([x, y - S(34)])
      zone('reeds', x + (n > 2 ? 0 : S(-8)), y - S(24), S(20 + n * 10), S(36))
    },
  }
}
