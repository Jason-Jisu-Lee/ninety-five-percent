import { adopt, save } from '../../core/save/save'
import { ctx, mk } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { shop } from '../../ui/shop/shop'
import { text } from '../../ui/text/text'
import { RECTS, WAYS } from './ways'

const K = 2, SAID = ['must buy Sharp Mandibles', 'must open Instinct', 'must buy Lunge', 'free: buy anything, or press Return']

export function figure(host: HTMLElement, n: number, bought: () => void) {
  const fig = host.appendChild(document.createElement('figure')), c = fig.appendChild(mk(W * K, H * K)), out = ctx(c), low = ctx(mk(W, H)), said = fig.appendChild(document.createElement('p')), view = shop(false)
  let mine = { blood: 33, levels: {} as Record<string, number> }, step = 0, since = 0, bad = 9, gone = -1, tab = 0, at = [-1, -1]
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${WAYS[n].name}<i>${WAYS[n].note}</i></figcaption>`)
  const load = () => adopt({ color: save.color, blood: mine.blood, levels: mine.levels }), rect = () => step === 1 ? RECTS.tab : RECTS.buy
  const inside = ([x, y, w, h]: number[]) => at[0] >= x && at[0] < x + w && at[1] >= y && at[1] < y + h

  function reset() {
    mine = { blood: 33, levels: {} }
    ;[step, since, bad, gone, tab] = [0, 0, 9, -1, 0]
    view.open(0, () => gone = 0)
  }

  c.onpointermove = e => at = [e.offsetX / K, e.offsetY / K]
  c.onpointerleave = () => at = [-1, -1]
  c.onpointerdown = e => {
    at = [e.offsetX / K, e.offsetY / K]
    if (gone >= 0) return
    if (step < 3 && !inside(rect())) return void (bad = 0)
    load()
    const had = save.blood
    view.hover(at[0], at[1])
    view.click()
    if (save.blood < had) bought()
    tab = inside(RECTS.home) ? 0 : inside(RECTS.tab) ? 1 : tab
    if (step === 0 && save.levels['Sharp Mandibles'] || step === 1 || step === 2 && save.levels.Lunge) [step, since] = [step + 1, 0]
    mine = { blood: save.blood, levels: { ...save.levels } }
  }

  reset()
  return {
    fig,
    frame(dt: number) {
      const line = gone >= 0 ? 'Return pressed: back to the hunt' : SAID[step] + (step < 3 && bad < .7 ? '   (that click was blocked)' : '')
      since += dt
      bad += dt
      if (gone >= 0 && (gone += dt) > 1.6) reset()
      if (said.textContent !== line) said.textContent = line
      load()
      if (step < 3 && !inside(rect())) view.hover(-1, -1)
      else view.hover(at[0], at[1])
      low.fillStyle = UI.night
      low.fillRect(0, 0, W, H)
      view.draw(low)
      if (gone < 0) WAYS[n].draw(low, { step, since, bad, rect: rect(), tab })
      else text(low, 'Back to the hunt', W / 2, H / 2, UI.dim, 'c')
      out.imageSmoothingEnabled = false
      out.drawImage(low.canvas, 0, 0, W * K, H * K)
    },
  }
}
