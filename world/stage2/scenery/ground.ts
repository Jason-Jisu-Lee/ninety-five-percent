import { dither } from '../../../core/draw/dither'
import { pixels } from '../../../core/draw/pixels'
import { clamp } from '../../../core/math/clamp'
import { fbm, vnoise } from '../../../core/math/noise'
import { once } from '../../../core/math/once'
import { rng } from '../../../core/math/rng'
import { FOREST as C } from '../../../data/look/palette'
import { H, W } from '../../../data/look/screen'
import { CLUMPS, DAISIES, DANDELIONS, PADS, REEDS, SCREE, SLABS, STALKS, STONES, TWIGS } from '../../../data/stage1/map'
import { BEDS, BOULDERS, FERNS, FIELD, INSET, LOG2, mini, PADS2, POND2, REEDS2, STREAM, STUMP } from '../../../data/stage2/map'
import { dandelion } from '../../stage1/scenery/flora'
import { pebble } from '../../stage1/scenery/litter'
import { log, logShade } from '../../stage1/scenery/log'
import { depth, pads, water } from '../../stage1/scenery/pond'
import { scree, slab } from '../../stage1/scenery/rocks'
import { stroke } from '../../stage1/scenery/stroke'
import { bloom, reedlet, tuft } from './small'
import { stump } from './stump'

const K = INSET.k, ca = Math.cos(LOG2.ang), sa = Math.sin(LOG2.ang), small = (list: number[][], flat: number) => list.map(([x, y, rx, ry]) => [...mini([x, y]), rx * K, ry * K, flat])
const ROCKS = [...BOULDERS.map(b => [...b, 0]), ...small(STONES, 0), ...small(SLABS, 1)].sort((a, b) => a[1] - b[1])

function brook(x: number, y: number) {
  let near = 999
  for (let i = 1; i < STREAM.path.length; i++) {
    const [ax, ay] = STREAM.path[i - 1], [bx, by] = STREAM.path[i], t = clamp(((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2))
    near = Math.min(near, Math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay)))
  }
  return STREAM.wide - near + (vnoise(x / 8, y / 8, 5) - .5) * 4
}

const wet = (x: number, y: number) => Math.max(depth(x, y, POND2), brook(x, y))

function open(x: number, y: number) {
  const u = (x - LOG2.x) * ca + (y - LOG2.y) * sa, v = -(x - LOG2.x) * sa + (y - LOG2.y) * ca
  return wet(x, y) < -7 && !(u > -6 && u < LOG2.len + 4 && Math.abs(v) < LOG2.r + 5) && Math.hypot(x - STUMP.x, (y - STUMP.y - 6) * 1.1) > STUMP.r + 8
    && !ROCKS.some(([rx, ry, a, b]) => ((x - rx) / (a + 2)) ** 2 + ((y - ry) / (b + 3)) ** 2 < 1)
}

export const ground2 = once(() => {
  const p = pixels(W, H), R = rng(2027), tall: [number, () => void][] = []
  const grow = (x: number, y: number, draw: () => void) => open(x, y) && tall.push([y, draw])
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const nl = fbm((x - INSET.x) / 55, (y - INSET.y) / 55, 5), nd = fbm((x - INSET.x) / 45 + 40, (y - INSET.y) / 45, 9)
    p.set(x, y, nl > .56 ? (dither(x, y, Math.min(.5, (nl - .56) * 5)) ? C.g2 : C.g1) : nd > .57 && dither(x, y, Math.min(.5, (nd - .57) * 5)) ? C.g0 : C.g1)
  }
  scree(p, FIELD)
  scree(p, { x: mini([SCREE.x, 0])[0], y: mini([0, SCREE.y])[1], rx: SCREE.rx * K, ry: SCREE.ry * K })
  water(p, wet, K, 0, 0, 340, H)
  pads(p, [...PADS.map(([x, y, r, notch]) => [...mini([x, y]), r * K, notch]), ...PADS2], K)
  logShade(p, LOG2)
  for (const { x, y, ang, len, bend } of TWIGS) stroke(p, ...mini([x, y]) as [number, number], ang, len * K, bend * K, () => .8, s => s > .2 ? C.t2 : C.t1)
  for (const [x, y, rx, ry, flat] of ROCKS) (flat ? slab : pebble)(p, x, y, rx, ry)
  log(p, LOG2)
  stump(p)
  for (const [x, y] of FERNS) grow(x, y, () => dandelion(p, x, y, R, false))
  for (const [x, y] of [...REEDS, ...STALKS].map(mini).concat(REEDS2)) tall.push([y, () => reedlet(p, x, y, R)])
  for (const [x, y] of CLUMPS.map(mini)) grow(x, y, () => tuft(p, Math.round(x), Math.round(y), R))
  for (const [i, list] of [DAISIES, DANDELIONS].entries()) for (const [x, y] of list.map(mini)) grow(x, y, () => bloom(p, Math.round(x), Math.round(y), i))
  for (const [bx, by, r, hue] of BEDS) for (let i = 0; i < r * 1.1; i++) {
    const a = R() * 6.283, d = Math.sqrt(R()) * r, x = Math.round(bx + Math.cos(a) * d), y = Math.round(by + Math.sin(a) * d * .7)
    grow(x, y, () => bloom(p, x, y, R() < .8 ? hue : 0))
  }
  for (let i = 0; i < 420; i++) {
    const x = R() * W | 0, y = R() * H | 0, lone = R() < .12, far = x < INSET.x || x > INSET.x + W * K || y < INSET.y || y > INSET.y + H * K
    if (far || R() < .35) grow(x, y, () => lone ? bloom(p, x, y, R() * 3 | 0) : tuft(p, x, y, R))
  }
  for (const [, draw] of tall.sort((a, b) => a[0] - b[0])) draw()
  return p.done()
})
