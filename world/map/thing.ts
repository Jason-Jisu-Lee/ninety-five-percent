import { dither } from '../../core/draw/dither'
import type { Pixels } from '../../core/draw/pixels'
import { FOREST as C } from '../../data/look/palette'
import { clover, daisy, dandelion, lily, mushroom } from '../stage1/scenery/flora'
import { clump } from '../stage1/scenery/grass'
import { leaf, pebble } from '../stage1/scenery/litter'
import { reed } from '../stage1/scenery/reeds'
import { slab } from '../stage1/scenery/rocks'
import { stroke } from '../stage1/scenery/stroke'
import { twig } from '../stage1/scenery/twig'
import { bloom, reedlet, tuft } from '../stage2/scenery/small'
import { fern } from './fern'
import { fruit } from './fruit'
import type { Kind, Thing } from './grow'

type Draw = (p: Pixels, t: Thing, x: number, y: number, k: number, R: () => number, deep: (x: number, y: number) => number) => unknown

export const FLAT: Kind[] = ['lily', 'clover', 'leaf', 'twig', 'pebble', 'slab', 'fruit']

export const DRAW: Record<Kind, Draw> = {
  clump: (p, t, x, y, k, R) => k > .62 ? clump(p, x, y, R, t.a, t.b * k, k) : tuft(p, x, y, R),
  daisy: (p, t, x, y, k) => k > .62 ? daisy(p, x, y, t.a, k) : bloom(p, x, y, 0),
  dandelion: (p, _t, x, y, k, R) => k > .62 ? dandelion(p, x, y, R, true, k) : bloom(p, x, y, 1),
  rosette: (p, t, x, y, k, R) => k <= .4 ? tuft(p, x, y, R) : t.own ? fern(p, x, y, R, k * t.a) : dandelion(p, x, y, R, false, k),
  clover: (p, t, x, y, k, R) => k > .62 ? clover(p, x, y, R, t.a, k) : p.oval(x, y, 9 * k + 1, 5 * k + 1, (px, py) => dither(px, py, .5) && C.cLight),
  reed: (p, t, x, y, k, R, deep) => k > .45 ? reed(p, x, y, t.a * k, t.b * k, t.c > 1, k, deep) : reedlet(p, x, y, R),
  pad: () => 0,
  lily: (p, _t, x, y, k) => k > .62 ? lily(p, x, y, k) : (p.set(x, y, C.white), p.set(x + 1, y, C.pink)),
  pebble: (p, t, x, y, k) => t.a * k < 1.3 ? p.set(x, y, C.r1) : pebble(p, x, y, t.a * k, Math.max(1, t.b * k)),
  slab: (p, t, x, y, k) => t.a * k < 2.5 ? (p.set(x, y, C.r2), p.set(x + 1, y, C.white)) : slab(p, x, y, t.a * k, t.b * k),
  mushroom: (p, t, x, y, k) => t.a * k < 1.7 ? (p.set(x, y - 1, C.husk), p.set(x, y, C.white)) : mushroom(p, x, y, t.a * k),
  leaf: (p, t, x, y, k) => k > .45 ? leaf(p, x, y, t.a, t.b * k) : (p.set(x, y, C.husk), p.set(x + 1, y, C.seed)),
  twig: (p, t, x, y, k) => k > .62 ? twig(p, { x, y, ang: t.a, len: t.b * k, bend: t.c * k }, k) : stroke(p, x, y, t.a, t.b * k, t.c * k, () => .8, s => s > .2 ? C.t2 : C.t1),
  fruit: (p, t, x, y, k) => fruit(p, x, y, Math.max(1.5, t.a * k)),
}
