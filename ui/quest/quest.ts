import { sound } from '../../audio/player/sound'
import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { save } from '../../core/save/save'
import { UI } from '../../data/look/palette'
import { QUESTS } from '../../data/game/quests'
import { W } from '../../data/look/screen'
import { banner } from '../parts/banner'
import { gauge } from '../parts/bar'
import { icon, orb } from '../parts/icons'
import { text, width } from '../text/text'
import { pop } from './pop'
import { shine } from './shine'

type Quest = typeof QUESTS[number]

const R = W - 8, BAR = 64, WAIT = .35, FLY = .45, GAP = .09, HOLD = 3, SLIDE = .3, FAR = 270, MAX = 8, GLOW = .12, LINE = 12, GLINT = [.4, .5], EVERY = 30, DONE = 'Objective Complete'
let seen = save.quest, done: Quest | undefined, at = 0, come = -9, rung = true, shone = 0, counted = save.count

const now = () => performance.now() / 1000, ease = (u: number) => clamp(u) ** 2
const drops = () => Math.min(done!.blood, MAX), landed = () => Math.max(0, Math.min(drops(), Math.floor((now() - at - WAIT - FLY) / GAP) + 1))
const pay = (q: Quest) => q.gives ?? (q.blood ? '+' + q.blood : ''), lead = (q: Quest) => q.blood ? 14 : 6, low = (q: Quest) => q.hint ? LINE : 0
const wide = (q: Quest) => Math.max(width(q.text), width(q.hint ?? ''), (pay(q) ? width(pay(q)) + (q.n > 1 ? lead(q) : 8) : 0) + (q.n > 1 ? BAR + 6 + width(`0 / ${q.n}`) : 0))

function sync() {
  if (save.quest !== seen) {
    done = save.quest > seen && pay(QUESTS[seen]) ? QUESTS[seen] : undefined
    ;[seen, at] = [save.quest, now()]
    ;[come, rung] = done ? [at + HOLD + SLIDE, false] : [-9, true]
    if (done) sound('quest')
  }
  if (done && now() - at >= HOLD + SLIDE * 2) done = undefined
}

export function owed() {
  sync()
  return done?.blood ? done.blood * (1 - landed() / drops()) : 0
}

export const since = () => (sync(), now() - at - HOLD - SLIDE * 2)
export const lit = () => !!done && landed() > 0 && now() - at - WAIT - FLY - (landed() - 1) * GAP < GLOW

function track(g: Ctx, q: Quest, got: number, col: string, dx: number, tick = false, dy = 0) {
  const r = R + dx, p = pay(q), y = dy + low(q), x = r - (p ? width(p) + lead(q) : 0) - BAR
  text(g, q.text, r, 41 + dy, col, 'r', UI.panel)
  if (q.hint) text(g, q.hint, r, 41 + LINE + dy, UI.text, 'r', UI.panel)
  if (q.n > 1) gauge(g, x, 48 + y, BAR, got / q.n, UI.accent), text(g, `${got} / ${q.n}`, x - 6, 54 + y, UI.accent, 'r', UI.panel)
  if (p) text(g, p, r, 54 + y, UI.gold, 'r', UI.panel)
  if (q.blood) orb(g, r - width(p) - 6, 50 + y, '', UI.panel)
  if (tick) icon(g, 'tick', r - width(q.text) - 11, 35, UI.accent, UI.panel)
}

export function quest(g: Ctx, born = 9) {
  sync()
  const q = QUESTS[save.quest], t = now() - at
  if (done && t < HOLD + SLIDE) {
    track(g, done, done.n, UI.gold, ease((t - HOLD) / SLIDE) * FAR, true)
    banner(g, DONE, [done.text], t, HOLD)
  } else if (q && born >= 0) {
    const u = Math.min(born, now() - come), w = wide(q), l = low(q), draw = (to: Ctx, dy = 0) => track(to, q, save.count, UI.text, 0, false, dy)
    if (!rung) sound('cork')
    pop(g, u, draw, [R - w / 2 - 1.5, 45 + l / 2, w / 2 + 7.5, 17 + l / 2])
    const v = (u - GLINT[0]) / GLINT[1]
    if (v < 1 || save.count !== counted) [shone, counted] = [now(), save.count]
    shine(g, v < 1 ? v : (now() - shone + GLINT[1]) % EVERY / GLINT[1], draw, R - w, w, 30, 30 + l)
  }
  rung ||= now() >= come
  if (!done) return
  const x = R - width(pay(done)) - 6, y = 50 + low(done)
  for (let i = 0; i < drops(); i++) {
    const u = (t - WAIT - i * GAP) / FLY, e = u * u * (3 - 2 * u)
    if (u > 0 && u < 1) orb(g, Math.round(x + (16 - x) * e), Math.round(y + (15 - y) * e - Math.sin(Math.PI * u) * 12), '', UI.panel)
  }
}
