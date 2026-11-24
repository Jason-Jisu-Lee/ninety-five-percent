import { bayer } from '../../core/draw/dither'
import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { chevron } from '../../ui/parts/chevron'
import { frame } from '../../ui/parts/frame'
import { icon } from '../../ui/parts/icons'
import { text, width } from '../../ui/text/text'

export type Now = { step: number; since: number; bad: number; rect: number[]; tab: number }

const L = 32, TAB = L + width('Anatomy') + 26, LOCK = [TAB + width('Instinct') + 22, 56, 16, 16], CELLS = [1, 2, 3].map(i => [L, 98 + i * 20, 184, 17])
export const RECTS = { buy: [L, 98, 184, 17], home: [L - 6, 54, width('Anatomy') + 12, 22], tab: [TAB - 6, 54, width('Instinct') + 12, 22], back: [W - L - 96, H - 40, 96, 20] }
const WORDS = ['Buy Sharp Mandibles', 'Open Instinct', 'Buy Lunge'], FREE = 'Buy what you like, then Return'
const mask = ctx(mk(W, H)), img = mask.createImageData(W, H), px = new Uint32Array(img.data.buffer)

function spot(g: Ctx, [x, y, w, h]: number[], pad: number) {
  for (let py = 0, i = 0; py < H; py++) for (let qx = 0; qx < W; qx++, i++) {
    const d = Math.hypot(Math.max(x - qx, 0, qx - x - w + 1), Math.max(y - py, 0, py - y - h + 1)), b = bayer(qx, py)
    px[i] = (d <= pad ? 1 : 1 - (d - pad) / 12) > b ? 0 : 0xd0000000
  }
  mask.putImageData(img, 0, 0)
  g.drawImage(mask.canvas, 0, 0)
}

function corners(g: Ctx, [x, y, w, h]: number[], e: number, dx = 0) {
  for (const [col, o] of [[UI.panel, 1], [UI.text, 0]] as const) {
    g.fillStyle = col
    for (const a of [0, 1]) for (const b of [0, 1]) {
      const cx = x - e + dx + o + a * (w + 2 * e - 1), cy = y - e + o + b * (h + 2 * e - 1)
      g.fillRect(a ? cx - 4 : cx, cy, 5, 1)
      g.fillRect(cx, b ? cy - 4 : cy, 1, 5)
    }
  }
}

function point(g: Ctx, [x, y, w, h]: number[], t: number) {
  const bob = +(t % .8 > .4)
  if (h > 20) return chevron(g, x + w / 2 - 2, y - 3 - bob, 1)
  for (let n = 0; n < 10; n++) {
    g.fillStyle = n < 9 ? UI.panel : UI.text
    for (let j = 0; j < 5; j++) g.fillRect(x + w + 6 + bob + Math.abs(j - 2) + (n < 9 ? n % 3 - 1 : 0), y + h / 2 - 2 + j + (n < 9 ? (n / 3 | 0) - 1 : 0), 1, 1)
  }
}

const shake = (bad: number) => bad < .24 ? Math.round(Math.sin(bad / .24 * Math.PI * 6) * 2) : 0
const hide = (g: Ctx, [x, y, w, h]: number[], lit = false) => {
  g.fillStyle = lit ? '#fff' : UI.night
  g.fillRect(x - 1, y - 1, w + 2, h + 2)
}

export const WAYS: { name: string; note: string; draw(g: Ctx, n: Now): void }[] = [
  {
    name: 'Spotlight',
    note: 'No words. The screen goes dark except a soft-edged light on the one thing to press, in the look of the circle that opens the game. A blocked click makes the light flinch. After Lunge the light bursts open over the whole Lair',
    draw(g, n) {
      if (n.step < 3) spot(g, n.rect, 5 + 30 * (1 - Math.min(1, n.since / .25)) ** 2 - (n.bad < .3 ? 4 * Math.sin(n.bad / .3 * Math.PI) : 0))
      else if (n.since < .7) spot(g, n.rect, 5 + 700 * (n.since / .7) ** 3)
    },
  },
  {
    name: 'Marks and arrow',
    note: 'No words. Nothing is darkened. The marks from the A key hint close in on the one thing to press, with a small arrow. Nothing else lights up or reacts. A blocked click shakes the marks. After Lunge the other category and Return blink',
    draw(g, n) {
      if (n.step < 3) {
        corners(g, n.rect, 2 + Math.round(7 * (1 - Math.min(1, n.since % 1.2 / .4)) ** 2), shake(n.bad))
        point(g, n.rect, n.since)
      } else if (n.since < .9 && n.since % .3 < .18) [n.tab ? RECTS.home : RECTS.tab, RECTS.back].forEach(r => corners(g, r, 2))
    },
  },
  {
    name: 'One thing at a time',
    note: 'No words. Only the thing to press is on the screen: first Sharp Mandibles alone, then the Instinct name pops in, then Lunge. After Lunge everything else pops in one by one, and Return last',
    draw(g, n) {
      const shown = (at: number) => n.step === 3 && n.since >= at, flash = (at: number) => n.step === 3 && n.since >= at && n.since < at + .07
      if (n.step === 0) hide(g, [TAB - 6, 54, 200, 22])
      else if (n.step === 1 && n.since < .07) hide(g, RECTS.tab, true)
      if (!shown(0)) hide(g, LOCK)
      else if (flash(0)) hide(g, LOCK, true)
      if (!n.tab) CELLS.forEach((r, i) => !shown(.15 + i * .12) ? hide(g, r) : flash(.15 + i * .12) && hide(g, r, true))
      if (!shown(.6)) hide(g, RECTS.back)
      else if (flash(.6)) hide(g, RECTS.back, true)
    },
  },
  {
    name: 'Checklist',
    note: 'With words (drafts). Three steps at the bottom, the current one in gold, done ones ticked. Marks sit on the thing to press and Return is locked until all three are done. A blocked click shakes the current step',
    draw(g, n) {
      let x = L
      if (n.step < 3) {
        corners(g, n.rect, 2)
        hide(g, RECTS.back)
        frame(g, RECTS.back[0], RECTS.back[1], 96, 20, false)
        text(g, 'Return', RECTS.back[0] + 54, RECTS.back[1] + 14, UI.faint, 'c')
        icon(g, 'lock', RECTS.back[0] + 14, RECTS.back[1] + 6, UI.faint)
      }
      if (n.step === 3) return text(g, FREE, L, H - 26, UI.gold)
      WORDS.forEach((w, i) => {
        const at = x + (i === n.step ? shake(n.bad) : 0)
        if (i < n.step) icon(g, 'tick', at, H - 32, UI.accent)
        text(g, w, at + 11, H - 26, i === n.step ? UI.gold : i < n.step ? UI.dim : UI.faint)
        x += width(w) + 28
      })
    },
  },
]
