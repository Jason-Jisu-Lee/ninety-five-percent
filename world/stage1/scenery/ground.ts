import { dither } from '../../../core/draw/dither'
import { fbm } from '../../../core/math/noise'
import { once } from '../../../core/math/once'
import { pixels } from '../../../core/draw/pixels'
import { rng } from '../../../core/math/rng'
import { FOREST as C } from '../../../data/look/palette'
import { H, W } from '../../../data/look/screen'
import { CLOVER, CLUMPS, DAISIES, DANDELIONS, LADYBUGS, LEAVES, LILIES, LOG, MUSHROOMS, PADS, PEBBLES, POND, REEDS, ROSETTES, SCREE, SLABS, STALKS, STONES, TWIGS } from '../../../data/stage1/map'
import { clover, daisy, dandelion, lily, mushroom } from './flora'
import { clump } from './grass'
import { ladybug, leaf, pebble } from './litter'
import { log, logShade } from './log'
import { depth, pads, water } from './pond'
import { reed } from './reeds'
import { scree, slab } from './rocks'
import { twig } from './twig'

export const ground = once(() => {
  const p = pixels(W, H), R = rng(2026), tall: [number, () => void][] = [
    ...CLUMPS.map(([x, y, n, len]): [number, () => void] => [y, () => clump(p, x, y, R, n, len)]),
    ...DAISIES.map(([x, y, rot]): [number, () => void] => [y, () => daisy(p, x, y, rot)]),
    ...DANDELIONS.map(([x, y]): [number, () => void] => [y, () => dandelion(p, x, y, R)]),
    ...ROSETTES.map(([x, y]): [number, () => void] => [y, () => dandelion(p, x, y, R, false)]),
    ...REEDS.map(([x, y, len, lean]): [number, () => void] => [y, () => reed(p, x, y, len, lean)]),
    ...STALKS.map(([x, y, len, lean]): [number, () => void] => [y, () => reed(p, x, y, len, lean, true)]),
    ...MUSHROOMS.map(([x, y, r]): [number, () => void] => [y, () => mushroom(p, x, y, r)]),
  ]
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const nl = fbm(x / 110, y / 110, 5), nd = fbm(x / 90 + 40, y / 90, 9)
    p.set(x, y, nl > .56 ? (dither(x, y, Math.min(.5, (nl - .56) * 5)) ? C.g2 : C.g1)
      : nd > .57 && dither(x, y, Math.min(.5, (nd - .57) * 5)) ? C.g0 : C.g1)
  }
  scree(p, SCREE)
  water(p, depth, 1, 0, 190, POND.x + POND.r, H)
  pads(p, PADS)
  for (const [x, y] of LILIES) lily(p, x, y)
  logShade(p, LOG)
  for (const [x, y, n] of CLOVER) clover(p, x, y, R, n)
  for (const [x, y, ang, len] of LEAVES) leaf(p, x, y, ang, len)
  for (const t of TWIGS) twig(p, t)
  for (const [x, y, rx, ry, flat] of [...PEBBLES, ...STONES, ...SLABS.map(s => [...s, 1])].sort((a, b) => a[1] - b[1])) (flat ? slab : pebble)(p, x, y, rx, ry)
  for (const [x, y] of LADYBUGS) ladybug(p, x, y)
  log(p, LOG)
  for (const [, draw] of tall.sort((a, b) => a[0] - b[0])) draw()
  return p.done()
})
