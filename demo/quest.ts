import type { Ctx } from '../core/screen/canvas'
import { FOREST as C, UI } from '../data/look/palette'
import { W } from '../data/look/screen'
import { blood } from '../ui/blood/blood'
import { drop } from '../ui/parts/icons'
import { panel } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { art, OLD, quest, R, view } from './kit'
import chime from './sounds/quest2.wav'

type Option = { name: string; note: string; from: [number, number]; draw(g: Ctx, since: number, dx: number): void }

const SH = 96, KILL = 1.2, PAY = 5, WAIT = .35, FLY = .45, GAP = .09, HOLD = 3, SLIDE = .3, REST = 2, FAR = 270
const NEW = 'View prey details (click prey) while resting', DONE = 'Objective Complete'
let ear = -1

const ease = (u: number) => Math.max(0, Math.min(1, u)) ** 2, flash = (since: number) => since < .12 ? '#ffffff' : UI.gold
const ink = (g: Ctx, x: number, y: number) => {
  for (let i = 0; i < 9; i++) drop(g, x - 1 + i % 3, y - 1 + (i / 3 | 0), UI.panel)
  drop(g, x, y, C.red)
}

const OPTIONS: Option[] = [
  {
    name: 'Where the quest was, same size', note: 'What you tested, held for 3 seconds', from: [R - 12, 50],
    draw: (g, since, dx) => quest(g, DONE, '3 / 3', flash(since), dx, true),
  },
  {
    name: 'Where the quest was, double size', note: 'Large gold text over the quest name. Common in action games', from: [R - 12, 69],
    draw(g, since, dx) {
      text(g, DONE, R + dx, 47, flash(since), 'r', UI.panel, 2)
      text(g, OLD, R + dx, 61, UI.text, 'r', UI.panel)
      text(g, '3 / 3', R + dx, 73, UI.accent, 'r', UI.panel)
    },
  },
  {
    name: 'Where the quest was, in a gold frame', note: 'A framed card slides in over the quest. Common in role playing games', from: [R - 16, 60],
    draw(g, since, dx) {
      const x = R - 136 + dx + (1 - ease(since / .25)) * 150
      panel(g, x, 31, 140, 37, flash(since), UI.panel)
      text(g, DONE, x + 70, 46, flash(since), 'c')
      text(g, OLD, x + 70, 59, UI.text, 'c')
    },
  },
  {
    name: 'Banner at the top centre', note: 'The quest gets a tick and a banner drops in. The style of Steam and console achievements', from: [R - 12, 50],
    draw(g, since, dx) {
      const y = -31 + 37 * (since < HOLD ? ease(since / .25) : 1 - ease((since - HOLD) / .25))
      quest(g, OLD, '3 / 3', UI.gold, dx, true)
      panel(g, W / 2 - 80, y, 160, 31, UI.border, UI.panel)
      text(g, DONE, W / 2, y + 13, flash(since), 'c')
      text(g, OLD, W / 2, y + 25, UI.text, 'c')
    },
  },
  {
    name: 'Title across the screen', note: 'Large text fades in over the play area. The style of Skyrim and Dark Souls', from: [R - 12, 50],
    draw(g, since, dx) {
      const half = width(DONE) + 8
      quest(g, OLD, '3 / 3', UI.gold, dx, true)
      g.globalAlpha = Math.max(0, Math.min(1, since / .25, (HOLD - since) / .4))
      text(g, DONE, W / 2, 72, UI.gold, 'c', UI.panel, 2)
      text(g, OLD, W / 2, 88, UI.text, 'c', UI.panel)
      for (const s of [-1, 1]) for (const [col, y] of [[UI.panel, 66], [UI.gold, 65]] as const) {
        g.fillStyle = col
        g.fillRect(W / 2 + s * half + (s < 0 ? -36 : 0), y, 36, 1)
      }
      g.globalAlpha = 1
    },
  },
]

const views = OPTIONS.map((o, n) => {
  const v = view(`<b>${n + 1}</b>${o.name} <i>${o.note}</i>`, W, SH), g = v.low
  let t = 0, rang = false
  v.c.onmousemove = () => ear = n
  return (dt: number) => {
    t += dt
    const since = t - KILL, landed = Math.max(0, Math.min(PAY, Math.floor((since - WAIT - FLY) / GAP) + 1)), got = since < 0 ? 0 : 1 + landed
    if (since >= 0 && !rang) {
      rang = true
      if (ear === n) void Object.assign(new Audio(chime), { volume: .6 }).play().catch(() => {})
    }
    if (since > HOLD + SLIDE * 2 + REST) [t, rang] = [0, false]
    v.fig.classList.toggle('on', ear === n)
    g.drawImage(art, 0, 0)
    blood(g, 2 + got)
    if (landed && since - WAIT - FLY - (landed - 1) * GAP < .12) text(g, String(2 + got), 24, 19, UI.gold, undefined, UI.panel)
    if (since >= 0 && since < .7) text(g, '+1', 236, Math.round(84 - since * 22), C.red, 'c', UI.panel)
    if (since < 0) quest(g, OLD, '2 / 3', UI.text)
    else if (since < HOLD + SLIDE) o.draw(g, since, ease((since - HOLD) / SLIDE) * FAR)
    else quest(g, NEW, '0 / 1', UI.text, (1 - ease((since - HOLD - SLIDE) / SLIDE)) * FAR)
    for (let i = 0; i < PAY; i++) {
      const u = (since - WAIT - i * GAP) / FLY, e = u * u * (3 - 2 * u)
      if (u > 0 && u < 1) ink(g, Math.round(o.from[0] + (16 - o.from[0]) * e), Math.round(o.from[1] + (15 - o.from[1]) * e - Math.sin(Math.PI * u) * 12))
    }
    v.show()
  }
})

let last = 0
function loop(now: number) {
  requestAnimationFrame(loop)
  const dt = Math.min(.05, (now - last) / 1000)
  last = now
  views.forEach(v => v(dt))
}
requestAnimationFrame(loop)
