import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { COLOR } from '../data/dragonfly/colors'
import { PREY } from '../data/enemies/enemies'
import { FOREST as C, UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { marks } from '../ui/parts/marks'
import { box, panel } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { wrap } from '../ui/text/wrap'
import { drawBug } from '../world/creatures/draw'
import { wear } from '../world/dragonfly/sprite/sheet'
import { ground } from '../world/stage1/scenery/ground'

type Look = { fill: string; alpha: number; edge?: (g: Ctx, x: number, y: number, w: number, h: number) => void; button: (g: Ctx, label: string, x: number, y: number, on: boolean) => void }

const LINES = wrap('There is less than 95% chance you will catch this enemy successfully.', 230), K = PREY.hoverfly, BX = 430, BY = 150, PY = BY - Math.round(K.h * .7)
const BW = 54, BH = 15, TOP = 240, HIGH = LINES.length * 12 + BH + 21, CROP = [150, 215, 340, 110], main = document.querySelector('main')!

function scene(g: Ctx) {
  const ang = Math.atan2(PY - 205, BX - 330), head = ((Math.round((ang + Math.PI / 2) / 6.283 * DF.headings) % DF.headings) + DF.headings) % DF.headings
  const [spr, sh] = wear(COLOR, [0, 0])(head, 0), pose = { x: BX, y: BY, h: K.h, ang: 2.6, flash: 0, seed: 0, wings: true }
  g.drawImage(ground(), 0, 0)
  drawBug(g, K, pose, K.len, 0, true)
  drawBug(g, K, pose, K.len, 0)
  g.drawImage(sh, 337 - (sh.width >> 1), 215 - (sh.height >> 1))
  g.drawImage(spr, 330 - (spr.width >> 1), 205 - (spr.height >> 1))
  marks(g, BX, PY, 7, UI.foe)
}

const rect = (g: Ctx, col: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = col
  g.fillRect(x, y, w, h)
}

const frame = (g: Ctx, col: string, x: number, y: number, w: number, h: number) => {
  for (const [a, b, c, d] of [[x + 2, y, w - 4, 1], [x + 2, y + h - 1, w - 4, 1], [x, y + 2, 1, h - 4], [x + w - 1, y + 2, 1, h - 4], [x + 1, y + 1, 1, 1], [x + w - 2, y + 1, 1, 1], [x + 1, y + h - 2, 1, 1], [x + w - 2, y + h - 2, 1, 1]]) rect(g, col, a, b, c, d)
}

const LOOKS: [string, string, Look][] = [
  ['1 Smoke glass', 'Dark see-through panel, no border. Flat buttons; the chosen one turns light with dark text', {
    fill: UI.panel, alpha: .8,
    edge: (g, x, y, w) => rect(g, UI.dim, x + 1, y, w - 2, 1),
    button(g, label, x, y, on) {
      box(g, x, y, BW, BH, on ? UI.border : UI.line, on ? UI.border : UI.line)
      text(g, label, x + BW / 2, y + 11, on ? UI.panel : UI.text, 'c')
    },
  }],
  ['2 Pond glass', 'Dark green see-through panel with a pale blue edge. Outlined buttons; the chosen one fills pale blue', {
    fill: C.deep, alpha: .85,
    edge: (g, x, y, w, h) => frame(g, C.glint, x, y, w, h),
    button(g, label, x, y, on) {
      box(g, x, y, BW, BH, C.glint, on ? C.glint : C.deep)
      text(g, label, x + BW / 2, y + 11, on ? UI.night : C.glint, 'c')
    },
  }],
  ['3 Bark and gold', 'Warm brown see-through panel with a thin gold edge, matching the evolution shop. Buttons are words; the chosen one is gold and underlined', {
    fill: C.t2, alpha: .85,
    edge: (g, x, y, w, h) => frame(g, UI.gold, x, y, w, h),
    button(g, label, x, y, on) {
      text(g, label, x + BW / 2, y + 11, on ? UI.gold : UI.dim, 'c')
      if (on) rect(g, UI.gold, x + (BW - width(label) >> 1), y + 13, width(label), 1)
    },
  }],
  ['4 Keycaps', 'Near-black see-through panel with a soft shadow. Raised key buttons; the chosen one is pressed down with white text', {
    fill: UI.night, alpha: .8,
    edge: (g, x, y, w, h) => {
      g.globalAlpha = .35
      rect(g, '#000', x + 2, y + h, w - 2, 2)
      rect(g, '#000', x + w, y + 2, 2, h)
      g.globalAlpha = 1
    },
    button(g, label, x, y, on) {
      const d = on ? 1 : 0
      rect(g, C.r0, x, y + 1, BW, BH)
      rect(g, on ? C.r1 : C.r2, x, y + d, BW, BH - 1)
      rect(g, on ? C.r0 : C.r1, x + 1, y + d + 1, BW - 2, BH - 3)
      text(g, label, x + BW / 2, y + 11 + d, on ? UI.text : UI.panel, 'c')
    },
  }],
  ['5 Red warning stripe', 'Dark see-through panel with a red stripe on the left to say "careful". Attack is the red button; the chosen one gets a white edge', {
    fill: UI.panel, alpha: .82,
    edge: (g, x, y, _w, h) => rect(g, UI.foe, x, y, 2, h),
    button(g, label, x, y, on) {
      const risky = label === 'Attack'
      box(g, x, y, BW, BH, on ? UI.text : risky ? UI.foe : UI.dim, risky ? '#5a1c14' : UI.panel)
      text(g, label, x + BW / 2, y + 11, UI.text, 'c')
    },
  }],
]

function dialog(g: Ctx, look: Look, sel: number) {
  const w = Math.max(...LINES.map(width), 2 * (BW + 8)) + 24, x = W - w >> 1, by = TOP + HIGH - BH - 6
  const tint = ctx(mk(w, HIGH))
  panel(tint, 0, 0, w, HIGH, look.fill, look.fill)
  g.globalAlpha = look.alpha
  g.drawImage(tint.canvas, x, TOP)
  g.globalAlpha = 1
  look.edge?.(g, x, TOP, w, HIGH)
  LINES.forEach((l, i) => text(g, l, W / 2, TOP + 15 + i * 12, UI.text, 'c'))
  ;['Attack', 'Cancel'].forEach((label, i) => look.button(g, label, (W - 2 * BW - 8 >> 1) + i * (BW + 8), by, i === sel))
}

const full = mk(W, H), fg = ctx(full)
const cards = LOOKS.map(([name, about, look]) => {
  const card = main.appendChild(document.createElement('section'))
  card.innerHTML = `<b>${name}</b><small>${about}</small><small>Left: Cancel chosen (as when the box opens). Right: pointer on Attack</small>`
  const row = card.appendChild(document.createElement('div')), shots = [1, 0].map(sel => {
    scene(fg)
    dialog(fg, look, sel)
    const c = row.appendChild(mk(CROP[2], CROP[3]))
    ctx(c).drawImage(full, CROP[0], CROP[1], CROP[2], CROP[3], 0, 0, CROP[2], CROP[3])
    return c
  })
  scene(fg)
  dialog(fg, look, 1)
  const whole = card.appendChild(mk(W, H))
  ctx(whole).drawImage(full, 0, 0)
  return [shots, whole] as const
})

function fit() {
  const wide = Math.min(W * 3, innerWidth - 48)
  cards.forEach(([shots, whole]) => {
    shots.forEach(c => c.style.width = (wide - 12) / 2 + 'px')
    whole.style.width = wide / 2 + 'px'
  })
}

addEventListener('resize', fit)
fit()
