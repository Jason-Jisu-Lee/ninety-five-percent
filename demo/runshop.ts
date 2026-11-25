import './seed'
import { save } from '../core/save/save'
import type { Ctx } from '../core/screen/canvas'
import { PREY } from '../data/enemies/enemies'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { WILD } from '../data/shop/wild'
import { info } from '../ui/enemy/card'
import { DW } from '../ui/parts/details'
import { frame } from '../ui/parts/frame'
import { orb } from '../ui/parts/icons'
import { panel } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { figure } from './base'

const NOW = WILD[0], NEXT = WILD[1], HIDE = '?????', kind = NOW.kind!, can = () => save.blood >= NOW.cost
const R = W - 8, B = H - 8
type Hit = [x: number, y: number, w: number, h: number]
const inside = (mx: number, my: number, [x, y, w, h]: Hit) => mx >= x && mx < x + w && my >= y && my < y + h
const price = (g: Ctx, n: number, r: number, y: number, col: string, edge?: string) => {
  const p = String(n)
  text(g, p, r, y, col, 'r', edge)
  orb(g, r - width(p) - 5, y - 4, col === UI.dim ? UI.dim : '', edge)
}
const soft = (g: Ctx, x: number, y: number, w: number, h: number, edge: string) => {
  g.globalAlpha = .84
  panel(g, x, y, w, h, edge, UI.panel)
  g.globalAlpha = 1
}

const WAYS: [string, string, (g: Ctx, mx: number, my: number) => Hit][] = [
  ['Now', 'The current two framed rows', (g, mx, my) => {
    const wide = Math.max(...WILD.map(w => width(w.name) + width(String(w.cost)))) + 30, x = R - wide, y = B - 32, hit: Hit = [x, y, wide, 15], hot = inside(mx, my, hit)
    frame(g, x, y, wide, 15, can())
    text(g, NOW.name, x + 6, y + 11, hot && can() ? UI.gold : UI.text)
    price(g, NOW.cost, x + wide - 6, y + 11, can() ? UI.text : UI.dim)
    frame(g, x, y + 17, wide, 15, false)
    text(g, HIDE, x + 6, y + 28, UI.dim)
    price(g, NEXT.cost, x + wide - 6, y + 28, UI.dim)
    return hit
  }],
  ['Plain list', 'No frames. Outlined words straight on the scene, like the quest. The name turns gold when you can afford it', (g, mx, my) => {
    const w = width(NOW.name) + width(String(NOW.cost)) + 16, hit: Hit = [R - w, B - 30, w, 12], hot = inside(mx, my, hit)
    text(g, NOW.name, R - width(String(NOW.cost)) - 14, B - 20, can() ? UI.gold : UI.text, 'r', UI.panel)
    price(g, NOW.cost, R, B - 20, can() ? UI.text : UI.dim, UI.panel)
    if (hot) g.fillStyle = UI.gold, g.fillRect(R - w + 2, B - 17, w - 2, 1)
    text(g, HIDE, R - width(String(NEXT.cost)) - 14, B - 6, UI.dim, 'r', UI.panel)
    price(g, NEXT.cost, R, B - 6, UI.dim, UI.panel)
    return hit
  }],
  ['Under the quest', 'Top right, under the quest, in the same outlined words; the bottom of the screen stays clear. The name turns gold when you can afford it', (g, mx, my) => {
    const w = width(NOW.name) + width(String(NOW.cost)) + 16, hit: Hit = [R - w, 62, w, 12], hot = inside(mx, my, hit)
    text(g, NOW.name, R - width(String(NOW.cost)) - 14, 72, can() ? UI.gold : UI.text, 'r', UI.panel)
    price(g, NOW.cost, R, 72, can() ? UI.text : UI.dim, UI.panel)
    if (hot) g.fillStyle = UI.gold, g.fillRect(R - w + 2, 75, w - 2, 1)
    text(g, HIDE, R - width(String(NEXT.cost)) - 14, 85, UI.dim, 'r', UI.panel)
    price(g, NEXT.cost, R, 85, UI.dim, UI.panel)
    return hit
  }],
  ['Filling bar', 'One bar that fills with your lifeblood and turns gold when the enemy is affordable; the next one is a dim line under it', (g, mx, my) => {
    const w = 96, x = R - w, y = B - 30, hit: Hit = [x, y, w, 15], hot = inside(mx, my, hit), k = Math.min(1, save.blood / NOW.cost)
    soft(g, x, y, w, 15, can() ? hot ? UI.text : UI.gold : UI.line)
    g.fillStyle = can() ? '#3a3020' : '#232a27'
    g.fillRect(x + 2, y + 2, Math.round((w - 4) * k), 11)
    text(g, NOW.name, x + 6, y + 11, can() ? UI.gold : UI.text)
    price(g, NOW.cost, R - 6, y + 11, can() ? UI.text : UI.dim)
    text(g, HIDE, x + 6, B - 4, UI.dim, undefined, UI.panel)
    price(g, NEXT.cost, R - 6, B - 4, UI.dim, UI.panel)
    return hit
  }],
  ['Side by side', 'Two soft chips in one row along the bottom: the next one dim on the left, the one to buy on the right', (g, mx, my) => {
    const w1 = width(NOW.name) + width(String(NOW.cost)) + 24, w2 = width(HIDE) + width(String(NEXT.cost)) + 24, y = B - 15, x = R - w1, hit: Hit = [x, y, w1, 15], hot = inside(mx, my, hit)
    soft(g, x - w2 - 4, y, w2, 15, UI.line)
    text(g, HIDE, x - w2 + 2, y + 11, UI.dim)
    price(g, NEXT.cost, x - 10, y + 11, UI.dim)
    soft(g, x, y, w1, 15, can() ? hot ? UI.text : UI.gold : UI.line)
    text(g, NOW.name, x + 6, y + 11, can() ? UI.gold : UI.text)
    price(g, NOW.cost, R - 6, y + 11, can() ? UI.text : UI.dim)
    return hit
  }],
]

const host = document.querySelector('section')!
WAYS.forEach(([name, say, draw], i) => figure(host, i + 1, name, say, (g, mx, my) => {
  const hit = draw(g, mx, my)
  if (inside(mx, my, hit)) info(g, kind, PREY[kind].hp, tall => [W - 8 - DW, hit[1] > H / 2 ? hit[1] - 6 - tall : hit[1] + 30])
}, () => save.blood = save.blood === 15 ? 6 : 15))
