import { ctx, mk, type Ctx } from '../../core/screen/canvas'
import { dissolve, veil } from '../../core/draw/dissolve'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { text } from '../text/text'

const EDGE = .7, HOLD = 1, READ = (s: string) => .6 + s.length * .045

export type Page = (string | number)[]

function plan(page: Page, fixed?: number) {
  const lines: [string, number][] = []
  let t = 0
  page.forEach((p, i) => {
    if (typeof p === 'number') return
    lines.push([p, t])
    const next = page[i + 1]
    t += typeof next === 'number' ? next : READ(p)
  })
  return { lines, end: fixed ?? t + HOLD + EDGE }
}

export function story(pages: Page[], done: () => void, lead = .6, back = .6, fixed?: number) {
  const layer = ctx(mk(W, H)), plans = pages.map(p => plan(p, fixed)), starts: number[] = []
  const END = plans.reduce((s, p) => (starts.push(s), s + p.end), lead)
  let t = -1, due = false
  const at = () => {
    let i = plans.length - 1
    while (i > 0 && t < starts[i]) i--
    return i
  }
  return {
    on: () => t >= 0,
    begin() {
      ;[t, due] = [0, true]
    },
    next() {
      if (t > lead && t < END) t = starts[at() + 1] ?? END
    },
    skip() {
      if (t < END) t = END
    },
    update(dt: number) {
      if (t < 0) return
      t += dt
      if (due && t >= END) {
        due = false
        done()
      }
      if (t >= END + back) t = -1
    },
    draw(g: Ctx) {
      if (t < 0) return
      veil(g, t < lead ? t / lead : t > END ? 1 - (t - END) / back : 1)
      if (t < lead || t >= END) return
      const i = at(), { lines, end } = plans[i], u = t - starts[i]
      lines.forEach(([line, a], j) => {
        if (u < a) return
        layer.clearRect(0, 0, W, H)
        text(layer, line, W / 2, H / 2 + 14 + (j - lines.length / 2) * 22, UI.text, 'c', undefined, 2)
        dissolve(g, layer.canvas, 0, 0, Math.min(1, (u - a) / EDGE, (end - u) / EDGE))
      })
    },
  }
}
