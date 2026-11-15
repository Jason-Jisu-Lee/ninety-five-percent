import { rgb, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { box } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import type { Sound } from './hear'

export type Display = (lo: Ctx, hi: Ctx, right: number, name: string, s: Sound, dt: number, k: number) => void

export const blend = (a: string, b: string, t: number) => `rgb(${rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * t))})`

export function chip(g: Ctx, right: number, name: string, wide: number, lift = 0) {
  const full = Math.ceil(width(name) + wide) + 15
  box(g, right - full, 8, full, 17, UI.border, UI.panel)
  text(g, name, right - 5, 20 - lift, UI.text, 'r')
  return right - full + 5
}
