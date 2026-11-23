import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { COLOR } from '../data/dragonfly/colors'
import { PREY } from '../data/enemies/enemies'
import { UI } from '../data/look/palette'
import { drawPrey } from '../world/creatures/draw'
import { move } from '../world/creatures/move'
import type { Prey } from '../world/creatures/prey'
import { wear } from '../world/dragonfly/sprite/sheet'
import { place } from '../world/place/place'

type Size = { len: number; wide: number; wing: number; chord: number }

const K = 4, VW = 136, VH = 100, X0 = 132, Y0 = 62, BIG = 10, CELL = 13, NOW: Size = { len: 2, wide: 1, wing: 2, chord: 1 }
const OPTIONS: [name: string, size: Size][] = [
  ['What the game has', NOW],
  ['Body one pixel longer', { ...NOW, len: 3 }],
  ['Wings one pixel longer on each side', { ...NOW, wing: 3 }],
  ['Wings one pixel broader', { ...NOW, chord: 2 }],
  ['Body longer and wings broader', { ...NOW, len: 3, chord: 2 }],
  ['Body longer and wings longer', { ...NOW, len: 3, wing: 3 }],
]
const SPOTS = [[176, 88], [190, 98], [204, 108], [226, 96], [240, 122], [168, 118], [214, 82], [236, 140]]
const pose = (kind: Prey['kind'], x: number, y: number, seed: number): Prey => ({ kind, x, y, h: PREY[kind].h, ang: seed * 6.283, hp: PREY[kind].hp, wings: true, gold: false, flash: 0, seed, age: 9, gx: x, gy: y, wait: 0, fear: 0, tired: 0, free: 0, vx: 0, vy: 0 })
const flies = SPOTS.map(([x, y], i) => pose('fruitfly', x, y, (i * .37 + .11) % 1)), moth = pose('moth', 252, 104, .08), one = pose('fruitfly', CELL / 2, CELL / 2 + PREY.fruitfly.h * .7, 0), probe = ctx(mk(CELL, CELL), { willReadFrequently: true })
const wearing = (s: Size, f: () => void) => {
  Object.assign(PREY.fruitfly, s)
  f()
  Object.assign(PREY.fruitfly, NOW)
}

function lit(s: Size) {
  let sum = 0, n = 0
  wearing(s, () => {
    for (let a = 0; a < 64; a++) for (const t of [0, .5 / PREY.fruitfly.beat]) {
      probe.clearRect(0, 0, CELL, CELL)
      drawPrey(probe, { ...one, ang: a / 64 * 6.283 }, t)
      sum += probe.getImageData(0, 0, CELL, CELL).data.filter((v, i) => i % 4 === 3 && v).length
      n++
    }
  })
  return sum / n
}

const base = lit(NOW), views: [Ctx, Ctx, Size][] = OPTIONS.map(([name, size], n) => {
  const fig = document.getElementById('options')!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(VW * K, VH * K)), more = Math.round((lit(size) / base - 1) * 100)
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n || 'Now'}</b>${name}<br><i>${size.len} long, ${size.wing * 2 + size.wide} across the wings${n ? `, about ${more}% more pixels than now` : ''}</i></figcaption>`)
  fig.style.width = VW * K + 4 + 'px'
  ctx(c).imageSmoothingEnabled = false
  return [ctx(c), ctx(mk(VW, VH)), size]
})

function frame(ms: number) {
  const t = ms / 1000, [spr, sh] = wear(COLOR)(DF.headings * .9 | 0, (t * 24 | 0) % DF.flapFrames)
  for (const p of flies) move(p, 1 / 60, t, 0, 0)
  for (const [g, low, size] of views) {
    low.drawImage(place().art, -X0, -Y0)
    low.translate(-X0, -Y0)
    wearing(size, () => {
      for (const sh of [true, false]) for (const p of flies) drawPrey(low, p, t, sh)
    })
    for (const sh of [true, false]) drawPrey(low, moth, t, sh)
    low.drawImage(sh, 207 - (spr.width >> 1), 146 - (spr.height >> 1))
    low.drawImage(spr, 198 - (spr.width >> 1), 132 - (spr.height >> 1))
    low.setTransform(1, 0, 0, 1, 0, 0)
    g.drawImage(low.canvas, 0, 0, VW * K, VH * K)
    probe.clearRect(0, 0, CELL, CELL)
    wearing(size, () => drawPrey(probe, { ...one, ang: -.5 }, 0))
    g.fillStyle = UI.border
    g.fillRect(6, 6, CELL * BIG + 4, CELL * BIG + 4)
    g.drawImage(place().art, 250, 160, CELL, CELL, 8, 8, CELL * BIG, CELL * BIG)
    g.drawImage(probe.canvas, 8, 8, CELL * BIG, CELL * BIG)
  }
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
