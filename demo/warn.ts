import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { COLOR } from '../data/dragonfly/colors'
import { PREY } from '../data/enemies/enemies'
import { FOREST, UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { dialog } from '../ui/parts/dialog'
import { marks } from '../ui/parts/marks'
import { box } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { drawBug } from '../world/creatures/draw'
import { wear } from '../world/dragonfly/sprite/sheet'
import { ground } from '../world/stage1/scenery/ground'

const SAY = 'There is less than 95% chance you will catch this enemy successfully.'
const TWO = ['There is less than 95% chance you will', 'catch this enemy successfully.']
const THREE = ['There is less than 95% chance', 'you will catch this enemy', 'successfully.']
const K = PREY.hoverfly, BX = 430, BY = 150, PY = BY - Math.round(K.h * .7), main = document.querySelector('main')!

function button(g: Ctx, label: string, x: number, y: number, w: number, on: boolean) {
  box(g, x, y, w, 15, on ? UI.accent : UI.border, UI.panel)
  text(g, label, x + w / 2, y + 11, on ? UI.accent : UI.text, 'c')
}

function scene(g: Ctx, tag = true) {
  const ang = Math.atan2(PY - 205, BX - 330), head = ((Math.round((ang + Math.PI / 2) / 6.283 * DF.headings) % DF.headings) + DF.headings) % DF.headings
  const [spr, sh] = wear(COLOR, [0, 0])(head, 0)
  g.drawImage(ground(), 0, 0)
  drawBug(g, K, { x: BX, y: BY, h: K.h, ang: 2.6, flash: 0, seed: 0, wings: true }, K.len, 0, true)
  drawBug(g, K, { x: BX, y: BY, h: K.h, ang: 2.6, flash: 0, seed: 0, wings: true }, K.len, 0)
  g.drawImage(sh, 330 + 7 - (sh.width >> 1), 215 - (sh.height >> 1))
  g.drawImage(spr, 330 - (spr.width >> 1), 205 - (spr.height >> 1))
  marks(g, BX, PY, 7, UI.foe)
  if (!tag) return
  const w = Math.max(width(K.name), 22) + 10, x = BX - (w >> 1), y = PY - 30
  box(g, x, y, w, 19, UI.border, UI.panel)
  text(g, K.name, BX, y + 11, UI.text, 'c')
  g.fillStyle = UI.foe
  g.fillRect(x + 4, y + 14, w - 8, 2)
}

const now = (g: Ctx) => {
  scene(g)
  const d = dialog()
  d.open([SAY], [['Attack', () => {}], ['Cancel', () => {}]])
  d.draw(g)
}

const small = (g: Ctx) => {
  scene(g)
  const w = Math.max(...TWO.map(width)) + 24, h = 60, x = W - w >> 1, y = 240
  box(g, x, y, w, h, UI.dim, FOREST.deep)
  TWO.forEach((l, i) => text(g, l, W / 2, y + 15 + i * 12, UI.text, 'c'))
  button(g, 'Attack', W / 2 - 58, y + h - 21, 54, false)
  button(g, 'Cancel', W / 2 + 4, y + h - 21, 54, true)
}

const pop = (g: Ctx) => {
  scene(g, false)
  const w = Math.max(...THREE.map(width)) + 16, h = 70, x = BX + 18, y = PY - 20
  g.fillStyle = UI.border
  g.fillRect(x - 4, PY - 1, 5, 3)
  box(g, x, y, w, h, UI.border, FOREST.deep)
  THREE.forEach((l, i) => text(g, l, x + 8, y + 13 + i * 12, UI.text))
  button(g, 'Attack', x + 8, y + h - 20, 50, false)
  button(g, 'Cancel', x + 62, y + h - 20, 50, true)
}

const again = (g: Ctx) => {
  scene(g)
  TWO.forEach((l, i) => text(g, l, BX, PY - 62 + i * 12, UI.text, 'c', UI.panel))
  text(g, 'Click again to attack', BX, PY - 38, UI.dim, 'c', UI.panel)
}

const toast = (g: Ctx) => {
  scene(g)
  const w = width(SAY) + 24, x = W - w >> 1, y = 40
  box(g, x, y, w, 18, UI.dim, FOREST.deep)
  text(g, SAY, W / 2, y + 12, UI.text, 'c')
}

const OPTIONS: [string, string, (g: Ctx) => void][] = [
  ['Now', 'For comparison: the current box with your new line', now],
  ['1 Small box', 'Game pauses, no dim over the game, dark green instead of black, buttons side by side, low on the screen', small],
  ['2 Pop-up at the enemy', 'Small dark green box beside the enemy with its own buttons; the game pauses', pop],
  ['3 Click again', 'No box. The line floats over the enemy; a second click attacks. The dim line is not your copy, only a placeholder', again],
  ['4 Banner', 'No buttons. A thin strip at the top; the attack goes ahead and the strip fades after a few seconds', toast],
]

const cards = OPTIONS.map(([name, about, draw]) => {
  const card = main.appendChild(document.createElement('section')), c = mk(W, H)
  card.innerHTML = `<b>${name}</b><small>${about}</small>`
  card.appendChild(c)
  draw(ctx(c))
  return c
})

function fit() {
  const wide = Math.min(W * 2, (innerWidth - 48) / 2 | 0)
  cards.forEach(c => c.parentElement!.style.width = c.style.width = wide + 'px')
}

addEventListener('resize', fit)
fit()
