import { ctx, mk } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { SHOP } from '../data/shop/shop'
import { shop } from '../ui/shop/shop'
import { text } from '../ui/text/text'

const K = Math.max(2, Math.round(2 * devicePixelRatio)), CX = 16, CY = 54, CW = 360, CH = 40, L = 32, Y = 88
const LINES: Record<string, string[]> = {
  Swarm: ['Many wings, one hunger', 'A thousand wings, and but one hunger', 'Of many wings, one hunger', 'Many are the wings, and one the hunger', 'Many wings, yet one hunger'],
  Anatomy: ['Shaped by the ages, sharpened by the hunt', 'The body remembereth every age it hath flown', 'Older than the mountains, and still it changeth', 'Each wing a gift of the dead', 'From the elder ages, a body for the hunt', 'Flesh of the old world, wings of the new'],
}
const blood = SHOP.filter(t => t.shop === 'Blood shop').map(t => t.name)
for (const [tab, lines] of Object.entries(LINES)) {
  const s = shop(), world = ctx(mk(W, H))
  s.open(0)
  for (let i = 0; i < blood.indexOf(tab); i++) s.key('ArrowRight')
  s.draw(world)
  world.fillStyle = UI.night
  world.fillRect(L, Y - 9, CW, 12)
  lines.forEach((line, n) => {
    const fig = document.getElementById(tab)!.appendChild(document.createElement('figure')), c = mk(CW * K, CH * K), g = ctx(c)
    fig.innerHTML = `<b>${n + 1}</b>`
    fig.appendChild(c).style.width = CW * K / devicePixelRatio + 'px'
    g.imageSmoothingEnabled = false
    g.setTransform(K, 0, 0, K, -CX * K, -CY * K)
    g.drawImage(world.canvas, 0, 0)
    text(g, line, L, Y, UI.dim)
  })
}
