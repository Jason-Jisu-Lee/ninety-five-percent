import { silent } from '../../audio/player/music'
import { dissolve, shade, veil } from '../../core/draw/dissolve'
import { clamp } from '../../core/math/clamp'
import { save } from '../../core/save/save'
import { ctx, mk } from '../../core/screen/canvas'
import { PREY } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { blood } from '../../ui/blood/blood'
import { feastButton } from '../../ui/feast/button'
import { nav } from '../../ui/nav/nav'
import { text } from '../../ui/text/text'
import { glow, now } from '../../ui/track/track'
import { nextWild } from '../../ui/wild/next'
import type { Prey } from '../../world/creatures/prey'
import { render } from '../../world/game/render'
import { hunt } from '../../world/hunt/hunt'
import { circle, HOLD, OPEN } from './circle'
import { hint } from './hint'
import { mask } from './mask'
import { pop } from './pop'
import { arrow } from './stamp'

const none = () => {}, wild = nextWild(none), bar = nav([none, none, none]), feast = feastButton(none), page = ctx(mk(W, H))
const PRE = 2.2, WAKE = OPEN + 1.2, QUEST = WAKE + 3, CONTROL = QUEST + 1, WAIT = 2.9, FROM = [452, 300], LAST = ['But an ancient bloodline survived', 'Dragonflies', 'The sky will be theirs again...']
LAST.forEach((line, j) => text(page, line, W / 2, H / 2 + 14 + (j - 1.5) * 22, UI.text, 'c', undefined, 2))

export function figure(host: HTMLElement, k: number, sound: () => void) {
  const c = host.appendChild(mk(W * k, H * k)), out = ctx(c), low = ctx(mk(W, H)), hole = mask(), said = host.appendChild(document.createElement('p'))
  let sim = hunt(), T = 0, clock = 0, got = 0, kills = 0, bit = -1, shut = -1, pressed = false, hot: Prey | null = null, aim: Prey | null = null, tip: number[] | null = null

  function reset() {
    sim = hunt()
    const kill = sim.prey.kill
    sim.prey.kill = (p, t) => {
      got += PREY[p.kind].blood
      kills++
      kill(p, t)
    }
    for (clock = 0; clock < 6; clock += 1 / 60) sim.prey.step(1 / 60, clock, -999, -999, null)
    ;[T, got, kills, bit, shut, pressed, hot, aim, tip] = [-PRE, 0, 0, -1, -1, false, null, null, null]
    Object.assign(save, { blood: 0, count: 0, quest: 0 })
  }

  const nearest = () => sim.prey.list.filter(p => p.kind === 'fruitfly' && p.x > 20 && p.x < W - 20 && p.y > 40 && p.y < H - 20).reduce<Prey | null>((a, b) => !a || sim.gap(b) < sim.gap(a) ? b : a, null)
  const phase = () => T < 0 ? 'the last black screen fades out' : T < HOLD ? 'dragonfly lit, music starts, everything is paused' : T < OPEN ? 'the circle bursts open, everything is still paused' : T < WAKE ? 'fully open, still paused' : T < QUEST ? 'the world moves, no control yet' : T < CONTROL ? 'the quest pops in, no control yet' : bit >= 0 ? 'first bite, the hint is gone' : pressed ? 'the player pressed A' : hot ? 'the player has the pointer on a fruit fly' : tip ? 'the player moves the pointer' : 'control starts, the hint shows'

  function step(dt: number) {
    if (shut >= 0) return void ((shut += dt) > .55 && reset())
    if (T < QUEST && (T += dt) >= QUEST) sound()
    else if (T >= QUEST) T += dt
    if (T < WAKE) return
    sim.step(dt, clock += dt)
    if (bit < 0 && sim.held) bit = T
    const t = T - CONTROL
    if (t >= 0 && bit < 0) {
      if (!aim || !sim.prey.list.includes(aim) || !tip && t % 2.4 < dt) aim = nearest()
      if (t >= WAIT && aim) {
        const u = clamp((t - WAIT) / .9), e = u * u * (3 - 2 * u)
        tip = [FROM[0] + (aim.x - FROM[0]) * e, FROM[1] + (aim.y - aim.h * .7 - FROM[1]) * e]
      }
    }
    hot = tip ? sim.prey.at(tip[0], tip[1], hot) : null
    if (t >= WAIT + 3.4 && bit < 0 && !sim.mark && hot) [sim.mark, pressed] = [hot, true]
    if (bit >= 0 ? T >= bit + 2.4 : t >= 16) shut = 0
  }

  function draw() {
    const t = T - CONTROL, line = `${Math.max(0, T).toFixed(1)} s   ${phase()}`
    if (said.textContent !== line) said.textContent = line
    if (T < 0) {
      low.fillStyle = '#000'
      low.fillRect(0, 0, W, H)
      dissolve(low, page.canvas, 0, 0, clamp((-T - .3) / .7))
    } else {
      render(low, sim, clock, T >= WAKE, hot, false)
      blood(low, got)
      pop(low, T - QUEST, kills)
      wild.draw(low)
      bar.draw(low, false, silent())
      now(low, W - 73)
      feast.draw(low)
      if (t >= 0 && bit < 0) hint(low, { t, aim, hot, marked: !!sim.mark })
    }
    if (shut >= 0) veil(low, Math.min(1, shut / .4))
    const dark = shade.n
    shade.n = 0
    out.imageSmoothingEnabled = false
    out.drawImage(low.canvas, 0, 0, W * k, H * k)
    if (T >= 0) glow(out, k, 1, dark)
    if (T >= 0 && T < OPEN) {
      const x = sim.fly.x, y = sim.fly.y - sim.fly.h * .7, cut = circle(T, Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 2)
      hole.cut(x, y, cut.r, cut.band, cut.show)
      out.drawImage(hole.canvas, 0, 0, W * k, H * k)
    }
    if (tip && shut < 0) arrow(out, tip[0] * k, tip[1] * k)
  }

  c.onclick = reset
  reset()
  return (dt: number) => {
    step(dt)
    draw()
  }
}
