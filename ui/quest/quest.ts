import { sound } from '../../audio/player/sound'
import type { Ctx } from '../../core/screen/canvas'
import { save } from '../../core/save/save'
import { FOREST as C, UI } from '../../data/look/palette'
import { QUESTS } from '../../data/game/quests'
import { W } from '../../data/look/screen'
import { drop, icon } from '../parts/icons'
import { text, width } from '../text/text'

const R = W - 8, WAIT = .35, FLY = .45, GAP = .09, STAY = 1.35, SLIDE = .3, FAR = 270, MAX = 8, GLOW = .12
let seen = save.quest, done: typeof QUESTS[number] | undefined, at = 0

const now = () => performance.now() / 1000, ease = (u: number) => Math.max(0, Math.min(1, u)) ** 2
const drops = () => Math.min(done!.blood, MAX), landed = () => Math.max(0, Math.min(drops(), Math.floor((now() - at - WAIT - FLY) / GAP) + 1))

function sync() {
  if (save.quest !== seen) {
    done = save.quest > seen ? QUESTS[seen] : undefined
    ;[seen, at] = [save.quest, now()]
    if (done) sound('quest')
  }
  if (done && now() - at >= STAY + SLIDE * 2) done = undefined
}

export function owed() {
  sync()
  return done ? done.blood * (1 - landed() / drops()) : 0
}

export const lit = () => !!done && landed() > 0 && now() - at - WAIT - FLY - (landed() - 1) * GAP < GLOW

function show(g: Ctx, name: string, sub: string, pay: number, col: string, dx: number, tick = false) {
  text(g, name, R + dx, 41, col, 'r', UI.panel)
  text(g, sub, R + dx, 53, UI.accent, 'r', UI.panel)
  text(g, String(pay), R + dx, 65, UI.text, 'r', UI.panel)
  drop(g, R + dx - width(String(pay)) - 6, 61, C.red, UI.panel)
  if (tick) icon(g, 'tick', R + dx - width(name) - 11, 35, UI.accent, UI.panel)
}

export function quest(g: Ctx) {
  sync()
  const q = QUESTS[save.quest], t = now() - at
  if (done && t < STAY + SLIDE) show(g, 'Objective Complete', `${done.n} / ${done.n}`, done.blood, UI.gold, ease((t - STAY) / SLIDE) * FAR, true)
  else if (q) show(g, q.text, `${save.count} / ${q.n}`, q.blood, UI.text, done ? (1 - ease((t - STAY - SLIDE) / SLIDE)) * FAR : 0)
  if (!done) return
  const x = R - width(String(done.blood)) - 6
  for (let i = 0; i < drops(); i++) {
    const u = (t - WAIT - i * GAP) / FLY, e = u * u * (3 - 2 * u)
    if (u > 0 && u < 1) drop(g, Math.round(x + (16 - x) * e), Math.round(61 - 46 * e - Math.sin(Math.PI * u) * 12), C.red, UI.panel)
  }
}
