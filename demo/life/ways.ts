import { bayer } from '../../core/draw/dither'
import { clamp } from '../../core/math/clamp'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { H, W } from '../../data/look/screen'
import { orb } from '../../ui/parts/icons'
import { text } from '../../ui/text/text'

export const HOLD = 5
const LINES = ['Lifeblood', 'Killing prey gives lifeblood'], BEAT = 1.2, fade = (u: number) => clamp(Math.min(u / .25, (HOLD - u) / .4))
const ARROW = ['...#...', '..###..', '.#####.', '#######', '..###..', '..###..', '..###..']

type Way = { name: string; note: string; late?: number; draw(g: Ctx, u: number, at: number[], from: number[], n: number): void }

function words(g: Ctx, u: number, at: number[]) {
  g.globalAlpha = fade(u)
  text(g, LINES[0], at[0] + at[2] + 24, at[1] + 9, UI.gold, undefined, UI.panel)
  text(g, LINES[1], at[0] + at[2] + 24, at[1] + 21, UI.text, undefined, UI.panel)
  g.globalAlpha = 1
}

function counter(g: Ctx, n: number, col: string) {
  orb(g, 16, 15, col, UI.panel)
  text(g, String(n), 24, 19, col, undefined, UI.panel)
}

function arrow(g: Ctx, x: number, y: number) {
  for (const [col, d] of [[UI.panel, 1], [UI.text, 0]] as const) {
    g.fillStyle = col
    ARROW.forEach((row, j) => [...row].forEach((c, i) => {
      if (c === '#') for (const [dx, dy] of d ? [[-1, 0], [1, 0], [0, -1], [0, 1]] : [[0, 0]]) g.fillRect(x + i + dx, y + j + dy, 1, 1)
    }))
  }
}

function ring(g: Ctx, x: number, y: number, e: number) {
  const r = 5 + 14 * e
  for (const [col, o] of [[UI.panel, 1], [UI.text, 0]] as const) for (let a = 0; a < 6.283; a += .5 / r) {
    const px = Math.round(x + Math.cos(a) * r) + o, py = Math.round(y + Math.sin(a) * r) + o
    g.fillStyle = col
    if (1.6 - e * 1.6 > bayer(px, py)) g.fillRect(px, py, 1, 1)
  }
}

export const WAYS: Way[] = [
  {
    name: 'Arrow',
    note: 'A white arrow under the counter points up at it and bobs one step every 0.4 s',
    draw(g, u, at) {
      g.globalAlpha = fade(u)
      arrow(g, at[0] + 1, at[1] + at[3] + 4 + (u % .8 > .4 ? 2 : 0))
      g.globalAlpha = 1
      words(g, u, at)
    },
  },
  {
    name: 'Rings',
    note: 'Three rings pulse out of the counter, 1.2 s each, like the rings on the rest spots when stamina runs out',
    draw(g, u, at) {
      if (u < BEAT * 3) ring(g, 16, 15, u % BEAT / BEAT)
      words(g, u, at)
    },
  },
  {
    name: 'Gold blink',
    note: 'The counter blinks gold three times, the way it lights when a quest reward lands',
    draw(g, u, at, _, n) {
      if (u < 1.8 && u % .6 < .3) counter(g, n, UI.gold)
      words(g, u, at)
    },
  },
  {
    name: 'Spotlight',
    note: 'The screen darkens around a circle of light on the counter, then clears. The game keeps running underneath',
    draw(g, u, at) {
      const k = clamp(Math.min(u / .3, (HOLD - u) / .5)) * .55
      g.fillStyle = `rgba(4,8,8,${k.toFixed(3)})`
      g.beginPath()
      g.rect(0, 0, W, H)
      g.arc(at[0] + at[2] / 2, 15, 20, 0, 6.283)
      g.fill('evenodd')
      words(g, u, at)
    },
  },
  {
    name: 'Shine',
    note: 'A white glint sweeps across the drop and the number every 1.2 s, like a new item in a shop',
    draw(g, u, at, _, n) {
      const s = u % BEAT / .5, x = at[0] - 5 + (at[2] + 10) * s
      if (s < 1) {
        g.save()
        g.beginPath()
        g.rect(Math.round(x), 0, 4, 30)
        g.clip()
        counter(g, n, '#ffffff')
        g.restore()
      }
      words(g, u, at)
    },
  },
  {
    name: 'Drop flies to the counter',
    late: .6,
    note: 'A blood drop flies from the kill to the counter in 0.6 s; the counter goes up and flashes gold as it lands',
    draw(g, u, at, [fx, fy], n) {
      const k = Math.min(1, u / .6), e = k * k * (3 - 2 * k), tx = at[0] + 3, ty = at[1] + 4
      if (k < 1) return orb(g, Math.round(fx + (tx - fx) * e), Math.round(fy + (ty - fy) * e - Math.sin(e * Math.PI) * 30), '', UI.panel)
      if (u < .85) counter(g, n, UI.gold)
      words(g, u, at)
    },
  },
]
