import { DF } from '../../../data/dragonfly/body'
import { body } from './body'
import type { Look } from './look'
import { raster, type Place } from './raster'
import { wings } from './wings'

export const size = (K: number) => 2 * Math.ceil(K * 13.2) + 1

export function sprite(a: number, phF: number, phH: number, col: Look, lift: number, grab: boolean, K: number, still = false, lean = 0) {
  const r = raster(size(K)), c = r.S / 2, ca = Math.cos(a), sa = Math.sin(a)
  const T: Place = (x, y, z = 0) => [c + K * (x * ca - y * sa), c + K * (x * sa + y * ca - z * lift)]
  if (grab) for (const s of [-1, 1]) for (const leg of DF.legs) r.line(leg.map(([x, y]) => T(x * s, y)), col.tip, 2)
  wings(r, T, col, phF, phH, lean, still)
  body(r, T, col, a, K, lean)
  return r
}
