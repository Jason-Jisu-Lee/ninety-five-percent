import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { SHOP } from '../data/shop/shop'
import { shop } from '../ui/shop/shop'
import { glyph, width } from '../ui/text/text'

const K = Math.max(2, Math.round(2 * devicePixelRatio)), CX = 0, CY = 40, CW = 400, CH = 150, L = 32, Y = 88
const LINE = SHOP.find(t => t.name === 'Instinct')!.note
const lean = (steps: number[]) => (g: Ctx) => {
  let x = 0
  g.fillStyle = UI.dim
  for (const ch of LINE) {
    glyph(ch).forEach((row, j) => {
      for (let i = 0; i < 5; i++) if (row >> 4 - i & 1) g.fillRect((L + x + i + (steps[j] ?? 0)) * K, (Y - 7 + j) * K, K, K)
    })
    x += width(ch) + 1
  }
}
const serif = (face: string) => (g: Ctx) => {
  g.font = `italic ${10 * K}px ${face}`
  g.fillStyle = UI.dim
  g.fillText(LINE, L * K, Y * K)
}
const WAYS: [string, (g: Ctx) => void][] = [
  ['Pixel italic, gentle slant', lean([1, 1, 1, 1, 0, 0, 0])],
  ['Pixel italic, strong slant', lean([2, 2, 1, 1, 1, 0, 0])],
  ['Serif italic (Georgia), smooth', serif('Georgia, serif')],
  ['Old style italic (Palatino), smooth', serif('"Palatino Linotype", Palatino, "Book Antiqua", serif')],
]
const world = ctx(mk(W, H)), s = shop()
s.open(0)
for (let i = 0; i < 2; i++) s.key('ArrowRight')
const views = WAYS.map(([caption, draw], n) => {
  const fig = document.querySelector('section')!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(CW * K, CH * K))
  c.style.width = CW * K / devicePixelRatio + 'px'
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${caption}</figcaption>`)
  const g = ctx(c)
  g.imageSmoothingEnabled = false
  return { g, draw }
})

function tick() {
  requestAnimationFrame(tick)
  s.draw(world)
  world.fillStyle = UI.night
  world.fillRect(L, Y - 9, CW - L, 12)
  for (const v of views) {
    v.g.setTransform(1, 0, 0, 1, 0, 0)
    v.g.drawImage(world.canvas, CX, CY, CW, CH, 0, 0, CW * K, CH * K)
    v.g.setTransform(1, 0, 0, 1, -CX * K, -CY * K)
    v.draw(v.g)
  }
}
tick()
