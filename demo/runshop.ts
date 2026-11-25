import './seed'
import { save } from '../core/save/save'
import { pack } from '../core/save/wild'
import type { Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { WILD } from '../data/shop/wild'
import { foe } from '../ui/enemy/card'
import { details, DW } from '../ui/parts/details'
import { orb } from '../ui/parts/icons'
import { panel } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { figure } from './base'

type Hit = [x: number, y: number, w: number, h: number]
const STEPS = [[0, 6], [0, 15], [2, 60]], HIDE = '?????', R = W - 8, B = H - 8
let step = 0
const now = () => WILD[pack.got], next = () => WILD[pack.got + 1], can = () => save.blood >= now().cost, part = () => Math.min(1, save.blood / now().cost)
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
const edge = (hot: boolean) => can() ? hot ? UI.text : UI.gold : UI.line
const later = (g: Ctx, x: number, y: number) => {
  text(g, HIDE, x, y, UI.dim, undefined, UI.panel)
  price(g, next().cost, R - 6, y, UI.dim, UI.panel)
}

const WAYS: [string, string, (g: Ctx, mx: number, my: number) => Hit][] = [
  ['Unlock track', 'The filling bar, with the whole ladder under it instead of the question marks: gold dots are bought, the white one is next, grey ones are still to come, the diamond is the next place', (g, mx, my) => {
    const w = 104, x = R - w, y = B - 30, hit: Hit = [x, y, w, 15], hot = inside(mx, my, hit), stage = now().stage, row = WILD.filter(v => v.stage === stage || v.stage === stage + 1 && !v.kind)
    soft(g, x, y, w, 15, edge(hot))
    g.fillStyle = can() ? UI.gilt : UI.well
    g.fillRect(x + 2, y + 2, Math.round((w - 4) * part()), 11)
    text(g, now().name, x + 6, y + 11, can() ? UI.gold : UI.text)
    price(g, now().cost, R - 6, y + 11, can() ? UI.text : UI.dim)
    row.forEach((v, i) => {
      const at = WILD.indexOf(v), cx = R - 5 - (row.length - 1 - i) * 12, cy = B - 5, r = at === pack.got ? 3 : 2
      if (i) g.fillStyle = at <= pack.got ? UI.gold : UI.line, g.fillRect(cx - 9, cy, 6, 1)
      g.fillStyle = UI.panel
      g.fillRect(cx - r - 1, cy - r - 1, r * 2 + 3, r * 2 + 3)
      g.fillStyle = at < pack.got ? UI.gold : at === pack.got ? UI.text : UI.dim
      if (v.kind) g.fillRect(cx - r, cy - r, r * 2 + 1, r * 2 + 1)
      else for (let j = -r; j <= r; j++) g.fillRect(cx - (r - Math.abs(j)), cy + j, (r - Math.abs(j)) * 2 + 1, 1)
    })
    return hit
  }],
  ['Ring', 'A round button in the corner. A ring around the lifeblood drop fills as you earn, and closes in gold when you can buy. The name and price sit beside it', (g, mx, my) => {
    const cx = R - 11, cy = B - 22, hit: Hit = [R - 76, cy - 11, 76, 23], hot = inside(mx, my, hit), k = part()
    g.globalAlpha = .84
    g.fillStyle = UI.panel
    for (let j = -10; j <= 10; j++) {
      const half = Math.floor(Math.sqrt(110 - j * j))
      g.fillRect(cx - half, cy + j, half * 2 + 1, 1)
    }
    g.globalAlpha = 1
    for (let a = 0; a < 1; a += 1 / 160) for (const r of [8, 9]) {
      g.fillStyle = a < k ? can() && hot ? UI.text : UI.gold : UI.line
      g.fillRect(Math.round(cx + Math.sin(a * 6.2832) * r), Math.round(cy - Math.cos(a * 6.2832) * r), 1, 1)
    }
    orb(g, cx, cy, can() ? '' : UI.dim)
    text(g, now().name, cx - 15, cy, can() ? UI.gold : UI.text, 'r', UI.panel)
    price(g, now().cost, cx - 15, cy + 11, can() ? UI.text : UI.dim, UI.panel)
    text(g, HIDE, R - 30, B - 1, UI.dim, 'r', UI.panel)
    price(g, next().cost, R, B - 1, UI.dim, UI.panel)
    return hit
  }],
  ['Buy button', 'A shop row with its own Buy button. The button is grey until you can afford the enemy, then gold. A thin line along the bottom shows how close you are', (g, mx, my) => {
    const bw = width('Buy') + 12, w = 96 + bw, x = R - w, y = B - 30, hit: Hit = [x, y, w, 15], hot = inside(mx, my, hit)
    soft(g, x, y, w, 15, edge(hot))
    text(g, now().name, x + 6, y + 11, UI.text)
    price(g, now().cost, R - bw - 6, y + 11, can() ? UI.text : UI.dim)
    g.fillStyle = can() ? hot ? UI.text : UI.gold : UI.well
    g.fillRect(R - bw, y + 2, bw - 2, 11)
    text(g, 'Buy', R - bw / 2 - 1, y + 11, can() ? UI.panel : UI.dim, 'c')
    g.fillStyle = UI.line
    g.fillRect(x + 3, y + 12, w - bw - 5, 1)
    g.fillStyle = UI.gold
    g.fillRect(x + 3, y + 12, Math.round((w - bw - 5) * part()), 1)
    later(g, x + 6, B - 4)
    return hit
  }],
  ['By the counter', 'Top left, under the Return to Lair button, so everything about lifeblood is in one corner and the bottom of the screen is clear. Outlined words with a thin bar', (g, mx, my) => {
    const w = 84, x = 8, y = 52, hit: Hit = [x, y, w, 16], hot = inside(mx, my, hit)
    text(g, now().name, x, y + 9, can() ? UI.gold : UI.text, undefined, UI.panel)
    price(g, now().cost, x + w, y + 9, can() ? UI.text : UI.dim, UI.panel)
    g.fillStyle = UI.panel
    g.fillRect(x - 1, y + 12, w + 2, 4)
    g.fillStyle = UI.line
    g.fillRect(x, y + 13, w, 2)
    g.fillStyle = can() ? hot ? UI.text : UI.gold : UI.dim
    g.fillRect(x, y + 13, Math.round(w * part()), 2)
    text(g, HIDE, x, y + 28, UI.dim, undefined, UI.panel)
    price(g, next().cost, x + w, y + 28, UI.dim, UI.panel)
    return hit
  }],
  ['Quiet until ready', 'While you cannot afford it, only one small outlined line shows, with how much you have. The moment you can, it becomes a gold button', (g, mx, my) => {
    const label = 'Buy ' + now().name, w = width(label) + width(String(now().cost)) + 28, hit: Hit = can() ? [R - w, B - 17, w, 17] : [R - 110, B - 12, 110, 12], hot = inside(mx, my, hit)
    if (can()) {
      soft(g, R - w, B - 17, w, 17, hot ? UI.text : UI.gold)
      g.fillStyle = UI.gilt
      g.fillRect(R - w + 2, B - 15, w - 4, 13)
      text(g, label, R - w + 7, B - 5, UI.gold)
      price(g, now().cost, R - 7, B - 5, UI.text)
    } else {
      const have = `${Math.floor(save.blood)} / ${now().cost}`
      text(g, have, R, B - 2, UI.dim, 'r', UI.panel)
      orb(g, R - width(have) - 5, B - 6, UI.dim, UI.panel)
      text(g, now().name, R - width(have) - 12, B - 2, hot ? UI.text : UI.dim, 'r', UI.panel)
    }
    return hit
  }],
]

const host = document.querySelector('section')!, click = () => {
  step = (step + 1) % STEPS.length
  ;[pack.got, save.blood] = STEPS[step]
}
;[pack.got, save.blood] = STEPS[0]
figure(host, 'Now', 'In the game', 'The filling bar you picked, as it is built', () => {}, { click })
WAYS.forEach(([name, say, draw], i) => figure(host, i + 1, name, say, (g, mx, my) => {
  const hit = draw(g, mx, my), k = now().kind
  if (k && inside(mx, my, hit)) details(g, foe(k), tall => [hit[0] > W / 2 ? W - 8 - DW : 8, hit[1] > H / 2 ? hit[1] - 6 - tall : hit[1] + hit[3] + 16])
}, { shop: false, click }))
