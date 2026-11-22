import type { Kit } from '../../world/place/kit'

type Coat = [dark: string, base: string, light: string]
type Part = [dx: number, dy: number, rx: number, ry: number, tone: number]

export const COAT: Record<string, Coat> = {
  rat: ['#3a302c', '#6b5a4e', '#8f7d6c'], rabbit: ['#4a3f38', '#8a7868', '#b3a08c'], fox: ['#6a2f1c', '#c2622a', '#e89a4a'], lynx: ['#5a4630', '#a8895a', '#d0b482'],
  wolf: ['#3a3d42', '#6f757a', '#a3a8aa'], bear: ['#2a1d18', '#4f372a', '#73543c'], duck: ['#3f3024', '#7a5f44', '#a88a62'], fisher: ['#1c4f8a', '#2f8fd0', '#e8862e'], crow: ['#101418', '#22282e', '#3a424a'],
}

function body(K: Kit, x: number, y: number, parts: Part[], coat: Coat, flip: boolean) {
  const each = (off: number, put: (px: number, py: number, ny: number, tone: number) => void) => {
    for (const [dx, dy, rx, ry, tone] of parts) for (let j = Math.floor(-ry); j <= ry; j++) for (let i = Math.floor(-rx); i <= rx; i++)
      if ((i / (rx + .3)) ** 2 + (j / (ry + .3)) ** 2 <= 1) put(Math.round(x + (flip ? -dx : dx) + i + off), Math.round(y + dy + j + off), j / (ry + .3), tone)
  }
  K.queue(y + 400, () => {
    each(3, (px, py) => K.b.dim(px, py + 1))
    each(0, (px, py, ny, tone) => K.b.set(px, py, coat[tone > 1 ? 2 : tone < 1 ? 0 : ny < -.3 ? 2 : ny > .5 ? 0 : 1]))
  })
}

export function beast(K: Kit, x: number, y: number, len: number, coat: Coat, flip = false, tail = .22) {
  const w = len * .2, legs = [[.2, 1], [.2, -1], [-.22, 1], [-.22, -1]].map(([u, s]): Part => [len * u, s * w * .9, len * .07, w * .32, 0])
  body(K, x, y, [...legs, [-len * (.34 + tail / 2), 0, len * tail / 2, w * .22, 1], [0, 0, len * .34, w, 1], [len * .34, w * .62, len * .04, w * .2, 0], [len * .34, -w * .62, len * .04, w * .2, 0], [len * .38, 0, len * .13, w * .68, 1], [len * .5, 0, len * .05, w * .3, 0]], coat, flip)
}

export function bird(K: Kit, x: number, y: number, len: number, coat: Coat, flip = false, wings = true, bill = '#e8a23a') {
  const w = len * .22, side = flip ? -1 : 1, spread: Part[] = wings ? [[-len * .05, w * 2, len * .2, w * 1.6, 0], [-len * .05, -w * 2, len * .2, w * 1.6, 0]] : []
  body(K, x, y, [...spread, [-len * .42, 0, len * .14, w * .7, 0], [0, 0, len * .34, w, 1], [len * .36, 0, len * .13, w * .62, 2]], coat, flip)
  K.queue(y + 401, () => {
    for (const i of [0, 1]) K.b.set(Math.round(x + side * (len * .5 + i)), Math.round(y), bill)
    if (!wings) for (let i = 2; i < len * .5; i += 2) for (const s of [-1, 1]) if (K.wet(x - side * (len * .4 + i), y + s * (w + i * .5))) K.b.set(Math.round(x - side * (len * .4 + i)), Math.round(y + s * (w + i * .5)), K.L.water[4])
  })
}
