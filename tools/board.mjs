import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { png } from './png.mjs'

export function boards(u32, glyph, ink) {
  const span = ch => {
    const m = glyph(ch).reduce((a, r) => a | r, 0)
    return m ? 5 - Math.log2(m & -m) : 3
  }
  return (w, h, bg = 0) => {
    const u = new Uint32Array(w * h).fill(bg)
    const g = {
      fillStyle: '',
      fillRect(x, y, rw, rh) {
        for (let j = y; j < y + rh; j++) for (let i = x; i < x + rw; i++) if (i >= 0 && j >= 0 && i < w && j < h) u[j * w + i] = u32(this.fillStyle)
      },
    }
    return {
      w, h, u, g,
      blit(src, sw, x, y) {
        src.forEach((v, i) => {
          const px = x + i % sw, py = y + (i / sw | 0)
          if (v && px >= 0 && py >= 0 && px < w && py < h) u[py * w + px] = v
        })
      },
      text(str, x, y, col = ink) {
        let cx = Math.round(x - [...str].reduce((n, ch) => n + span(ch) + 1, -1) / 2)
        g.fillStyle = col
        for (const ch of str) {
          glyph(ch).forEach((row, j) => {
            for (let i = 0; i < 5; i++) if (row >> 4 - i & 1) g.fillRect(cx + i, y + j, 1, 1)
          })
          cx += span(ch) + 1
        }
      },
      save(path, k = 8) {
        const W = w * k, big = new Uint32Array(W * h * k)
        for (let i = 0; i < big.length; i++) big[i] = u[(i / W / k | 0) * w + (i % W / k | 0)]
        mkdirSync(dirname(path), { recursive: true })
        writeFileSync(path, png(big, W, h * k))
      },
    }
  }
}
