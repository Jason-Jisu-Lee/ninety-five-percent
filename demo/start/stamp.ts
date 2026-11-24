import type { Ctx } from '../../core/screen/canvas'

export function stamp(g: Ctx, rows: string[], x: number, y: number, inks: Record<string, string>, edge = '') {
  if (edge) for (let n = 0; n < 9; n++) stamp(g, rows, x + n % 3 - 1, y + (n / 3 | 0) - 1, Object.fromEntries(Object.keys(inks).map(k => [k, edge])))
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (inks[row[i]]) {
      g.fillStyle = inks[row[i]]
      g.fillRect(x + i, y + j, 1, 1)
    }
  })
}

export function disc(g: Ctx, x: number, y: number, r: number, col: string) {
  g.fillStyle = col
  for (let j = -r; j <= r; j++) {
    const w = Math.floor(Math.sqrt((r + .5) ** 2 - j * j))
    g.fillRect(x - w, y + j, w * 2 + 1, 1)
  }
}

export function arrow(g: Ctx, x: number, y: number) {
  g.beginPath()
  ;[[0, 0], [0, 17], [4, 13.4], [7, 20], [9.6, 18.8], [6.7, 12.4], [12, 12.4]].forEach(([a, b], i) => g[i ? 'lineTo' : 'moveTo'](x + a * 1.2, y + b * 1.2))
  g.closePath()
  g.lineJoin = 'round'
  g.lineWidth = 1.5
  g.fillStyle = '#fff'
  g.strokeStyle = '#000'
  g.fill()
  g.stroke()
}
