import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { logo } from '../ui/front/logo'
import { glyph } from '../ui/text/text'
import { scene } from '../world/place/place'

const K = 3, VW = 272, VH = 82, X = 22, Y = 20

function word(g: Ctx, str: string, x: number, y: number, s: number) {
  for (const [col, d] of [['#0b1716', Math.max(1, s * 2 / 3 | 0)], ['#ece5d5', 0]] as const) {
    g.fillStyle = col
    ;[...str].forEach((ch, n) => glyph(ch).forEach((row, r) => {
      for (let c = 0; c < 5; c++) if (row >> 4 - c & 1) g.fillRect(x + (n * 6 + c) * s + d, y + r * s + d, s, s)
    }))
  }
}

const OPTIONS: [name: string, note: string, draw: (g: Ctx) => void][] = [
  ['Ninety-Five Percent', 'In the game now', g => g.drawImage(logo(), X - 2, Y - 2)],
  ['95%', 'The number alone, twice the size', g => word(g, '95%', X, Y, 6)],
  ['95% with the name under it', 'The number as the mark, the full name small beneath', g => {
    word(g, '95%', X, Y - 6, 6)
    word(g, 'NINETY-FIVE PERCENT', X, Y + 46, 1)
  }],
]

OPTIONS.forEach(([name, note, draw], n) => {
  const fig = document.getElementById('options')!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(VW * K, VH * K)), g = ctx(c), low = ctx(mk(VW, VH))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n || 'Now'}</b>${name}<br><i>${note}</i></figcaption>`)
  fig.style.width = VW * K + 4 + 'px'
  g.imageSmoothingEnabled = false
  low.drawImage(scene(1).art, 0, 0)
  draw(low)
  g.drawImage(low.canvas, 0, 0, VW * K, VH * K)
})
