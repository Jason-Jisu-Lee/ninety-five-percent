import { ctx, mk } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { SHOP } from '../data/shop/shop'
import { shop } from '../ui/shop/shop'
import { text } from '../ui/text/text'

const K = Math.max(2, Math.round(2 * devicePixelRatio)), CX = 16, CY = 54, CW = 360, CH = 40, L = 32, Y = 88
const LINES: Record<string, string[]> = {
  Appetite: ["Grant it hunger, grant it blood", "Drink, and be stronger for it", "Every drop, accounted for", "Feed it, and it grows", "Hunger remembers what the belly forgets", "Take, and take again"],
  Instinct: ["Grant it memory, grant it speed", "It knew before it was born", "Strike first, think never", "The body moves, the mind follows", "Trust the older blood", "Taught by no one"],
  Swarm: ["Grant it kin, grant it numbers", "Never alone over the water", "One hunger, many mouths", "The sky grows crowded", "Where one hunts, the rest follow", "Call them, and they come"],
  Wildlife: ["Grant it shores, grant it prey", "The pond is only the beginning", "New water, old hunger", "Every shore hides something", "Seek the far water", "The map is wider than it looks"],
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
