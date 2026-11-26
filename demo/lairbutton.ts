import './seed'
import { save } from '../core/save/save'
import { u32, type Ctx } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { WING } from '../data/dragonfly/colors'
import { UI } from '../data/look/palette'
import { note } from '../ui/parts/note'
import { soft } from '../ui/parts/panel'
import { glyph, text, width } from '../ui/text/text'
import { SLOTS } from '../ui/wild/next'
import { look } from '../world/dragonfly/sprite/look'
import { sprite } from '../world/dragonfly/sprite/sprite'
import { figure } from './base'

type Hit = [x: number, y: number, w: number, h: number]
const TIP = ['Return to Lair', 'End this run'], RX = SLOTS[0] + SLOTS[2], SY = SLOTS[1], SHADE = '#0b1716', MID = 3.65, CREAM = ['#b3ac9d', '#ece5d5'], GOLD = ['#9a7d45', UI.gold], DARK = [SHADE, SHADE], made = new Map<string, HTMLCanvasElement>()
const inside = (mx: number, my: number, [x, y, w, h]: Hit) => mx >= x && mx < x + w && my >= y && my < y + h

function fly(K: number, tone?: readonly string[]) {
  const key = K + String(tone), col = look(save.color), wing = [col.fill, col.vein, WING.costa, WING.stigma].map(u32)
  if (made.has(key)) return made.get(key)!
  const r = sprite(0, 0, 0, col, DF.lift, 0, K, true)
  if (tone) r.p.u.forEach((v, i) => v && (r.p.u[i] = u32(tone[+wing.includes(v)])))
  made.set(key, r.p.done())
  return made.get(key)!
}

function mark(g: Ctx, cx: number, cy: number, K: number, tone?: readonly string[], shade = 0) {
  const at = (c: HTMLCanvasElement, d: number) => g.drawImage(c, Math.round(cx - c.width / 2) + d, Math.round(cy - c.height / 2 - MID * K) + d)
  if (shade) at(fly(K, DARK), shade)
  at(fly(K, tone), 0)
}

function disc(g: Ctx, cx: number, cy: number, r: number, edge: string, to = cx) {
  for (const [col, rad, see] of [[edge, r, 1], [UI.panel, r - 1, .84]] as const) {
    g.fillStyle = col
    g.globalAlpha = see
    for (let j = -rad; j <= rad; j++) {
      const half = Math.floor(Math.sqrt(rad * rad + rad - j * j))
      if (see < 1) g.clearRect(cx - half, cy + j, to - cx + half * 2 + 1, 1)
      g.fillRect(cx - half, cy + j, to - cx + half * 2 + 1, 1)
    }
  }
  g.globalAlpha = 1
}

function letters(g: Ctx, str: string, x: number, y: number, col: string) {
  for (const [ink, d] of [[SHADE, 2], [col, 0]] as const) {
    g.fillStyle = ink
    ;[...str].forEach((ch, n) => glyph(ch).forEach((row, r) => {
      for (let c = 0; c < 5; c++) if (row >> 4 - c & 1) g.fillRect(x + (n * 6 + c) * 2 + d, y + r * 2 + d, 2, 2)
    }))
  }
}

function word(g: Ctx, [head, tail]: string[], x: number, y: number, col: string, tone?: readonly string[]) {
  letters(g, head, x, y, col)
  mark(g, x + head.length * 12 + 8, y + 7, 1.05, tone, 2)
  letters(g, tail, x + head.length * 12 + 18, y, col)
}

const WAYS: [string, string, (g: Ctx, mx: number, my: number) => number | void][] = [
  ['Badge', 'A round button with the dragonfly on it, much bigger than the last icons. Gold under the pointer', (g, mx, my) => {
    const hit: Hit = [RX - 33, SY - 39, 33, 33], hot = inside(mx, my, hit)
    disc(g, RX - 17, SY - 23, 16, hot ? UI.gold : UI.line)
    mark(g, RX - 17, SY - 23, 1.45, hot ? GOLD : CREAM)
    return hot ? hit[1] : undefined
  }],
  ['Badge with your dragonfly', 'The same round button, with the dragonfly in the colour the player chose', (g, mx, my) => {
    const hit: Hit = [RX - 33, SY - 39, 33, 33], hot = inside(mx, my, hit)
    disc(g, RX - 17, SY - 23, 16, hot ? UI.gold : UI.line)
    mark(g, RX - 17, SY - 23, 1.45)
    return hot ? hit[1] : undefined
  }],
  ['Badge with its name', 'The round button with the word Lair beside it, so nobody has to guess', (g, mx, my) => {
    const hit: Hit = [RX - 38 - width('Lair'), SY - 39, 38 + width('Lair'), 33], hot = inside(mx, my, hit)
    disc(g, RX - 17, SY - 23, 16, hot ? UI.gold : UI.line)
    mark(g, RX - 17, SY - 23, 1.45, hot ? GOLD : CREAM)
    text(g, 'Lair', RX - 38, SY - 19, hot ? UI.gold : UI.text, 'r', UI.panel)
    return hot ? hit[1] : undefined
  }],
  ['Pill', 'A taller button with rounded ends: the dragonfly, then the full words', (g, mx, my) => {
    const w = width(TIP[0]) + 40, hit: Hit = [RX - w, SY - 27, w, 23], hot = inside(mx, my, hit)
    disc(g, hit[0] + 11, SY - 16, 11, hot ? UI.gold : UI.line, RX - 12)
    mark(g, hit[0] + 16, SY - 16, 1.05, hot ? GOLD : CREAM)
    text(g, TIP[0], hit[0] + 30, SY - 12, hot ? UI.gold : UI.text)
    return hot ? hit[1] : undefined
  }],
  ['Name with a dragonfly', 'LAIR in the letters of the game title, with the dragonfly standing in for the I', (g, mx, my) => {
    const hit: Hit = [RX - 54, SY - 24, 54, 18], hot = inside(mx, my, hit)
    word(g, ['LA', 'R'], hit[0], hit[1], hot ? UI.gold : CREAM[1], hot ? GOLD : CREAM)
    return hot ? hit[1] : undefined
  }],
  ['Name with your dragonfly', 'The same name, but the I is the dragonfly itself, in the colour the player chose', (g, mx, my) => {
    const hit: Hit = [RX - 54, SY - 24, 54, 18], hot = inside(mx, my, hit)
    word(g, ['LA', 'R'], hit[0], hit[1], hot ? UI.gold : CREAM[1])
    return hot ? hit[1] : undefined
  }],
  ['Name on a plate', 'Lair in small letters on a soft plate, the dragonfly standing in for the i', (g, mx, my) => {
    const hit: Hit = [RX - 66, SY - 30, 66, 26], hot = inside(mx, my, hit)
    soft(g, ...hit, hot ? UI.gold : UI.line)
    word(g, ['La', 'r'], hit[0] + 8, hit[1] + 5, hot ? UI.gold : UI.text, hot ? GOLD : CREAM)
    return hot ? hit[1] : undefined
  }],
]

const host = document.querySelector('section')!
WAYS.forEach(([name, say, draw], i) => figure(host, i + 1, name, say, (g, mx, my) => {
  const top = draw(g, mx, my)
  if (top) note(g, TIP, RX, top - 4, true, true)
}, { lair: false }))
