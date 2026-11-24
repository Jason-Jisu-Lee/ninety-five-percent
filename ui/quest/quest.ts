import { sound } from '../../audio/player/sound'
import type { Ctx } from '../../core/screen/canvas'
import { save } from '../../core/save/save'
import { UI } from '../../data/look/palette'
import { QUESTS } from '../../data/game/quests'
import { W } from '../../data/look/screen'
import { icon, orb } from '../parts/icons'
import { text, width } from '../text/text'
import { pop } from './pop'

const R = W - 8, BAR = 64, WAIT = .35, FLY = .45, GAP = .09, HOLD = 3, SLIDE = .3, FAR = 270, MAX = 8, GLOW = .12, DONE = 'Objective Complete'
let seen = save.quest, done: typeof QUESTS[number] | undefined, at = 0

const now = () => performance.now() / 1000, ease = (u: number) => Math.max(0, Math.min(1, u)) ** 2
const drops = () => Math.min(done!.blood, MAX), landed = () => Math.max(0, Math.min(drops(), Math.floor((now() - at - WAIT - FLY) / GAP) + 1))

function sync() {
  if (save.quest !== seen) {
    done = save.quest > seen ? QUESTS[seen] : undefined
    ;[seen, at] = [save.quest, now()]
    if (done) sound('quest')
  }
  if (done && now() - at >= HOLD + SLIDE * 2) done = undefined
}

export function owed() {
  sync()
  return done ? done.blood * (1 - landed() / drops()) : 0
}

export const lit = () => !!done && landed() > 0 && now() - at - WAIT - FLY - (landed() - 1) * GAP < GLOW

function track(g: Ctx, q: typeof QUESTS[number], got: number, col: string, dx: number, tick = false, dy = 0) {
  const r = R + dx, pay = '+' + q.blood, x = r - width(pay) - 14 - BAR
  text(g, q.text, r, 41 + dy, col, 'r', UI.panel)
  g.fillStyle = UI.panel
  g.fillRect(x - 1, 47 + dy, BAR + 2, 6)
  g.fillStyle = UI.line
  g.fillRect(x, 48 + dy, BAR, 4)
  g.fillStyle = UI.accent
  g.fillRect(x, 48 + dy, Math.round(BAR * Math.min(1, got / q.n)), 4)
  text(g, pay, r, 54 + dy, UI.gold, 'r', UI.panel)
  orb(g, r - width(pay) - 6, 50 + dy, '', UI.panel)
  text(g, `${got} / ${q.n}`, x - 6, 54 + dy, UI.accent, 'r', UI.panel)
  if (tick) icon(g, 'tick', r - width(q.text) - 11, 35, UI.accent, UI.panel)
}

function title(g: Ctx, name: string, t: number) {
  const half = width(DONE) + 8
  g.globalAlpha = Math.max(0, Math.min(1, t / .25, (HOLD - t) / .4))
  text(g, DONE, W / 2, 72, UI.gold, 'c', UI.panel, 2)
  text(g, name, W / 2, 88, UI.text, 'c', UI.panel)
  for (const s of [-1, 1]) for (const [col, y] of [[UI.panel, 66], [UI.gold, 65]] as const) {
    g.fillStyle = col
    g.fillRect(W / 2 + s * half + (s < 0 ? -36 : 0), y, 36, 1)
  }
  g.globalAlpha = 1
}

export function quest(g: Ctx, born = 9) {
  sync()
  const q = QUESTS[save.quest], t = now() - at
  if (done && t < HOLD + SLIDE) {
    track(g, done, done.n, UI.gold, ease((t - HOLD) / SLIDE) * FAR, true)
    title(g, done.text, t)
  } else if (q && born >= 0) pop(g, born, (to, dy) => track(to, q, save.count, UI.text, done ? (1 - ease((t - HOLD - SLIDE) / SLIDE)) * FAR : 0, false, dy))
  if (!done) return
  const x = R - width('+' + done.blood) - 6
  for (let i = 0; i < drops(); i++) {
    const u = (t - WAIT - i * GAP) / FLY, e = u * u * (3 - 2 * u)
    if (u > 0 && u < 1) orb(g, Math.round(x + (16 - x) * e), Math.round(50 - 35 * e - Math.sin(Math.PI * u) * 12), '', UI.panel)
  }
}
