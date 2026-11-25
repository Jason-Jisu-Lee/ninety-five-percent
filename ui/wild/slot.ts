import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { orb } from '../parts/icons'
import { soft } from '../parts/panel'
import { text, width } from '../text/text'

export const TALL = 15

export function tag(g: Ctx, name: string, cost: number, x: number, y: number, w: number, ink: string, pay: string, edge?: string) {
  const p = String(cost)
  text(g, name, x + 6, y, ink, undefined, edge)
  text(g, p, x + w - 6, y, pay, 'r', edge)
  orb(g, x + w - 11 - width(p), y - 4, pay === UI.dim ? UI.dim : '', edge)
}

export function slot(g: Ctx, name: string, cost: number, x: number, y: number, w: number, can: boolean, hot: boolean) {
  soft(g, x, y, w, TALL, can ? hot ? UI.text : UI.gold : UI.line)
  tag(g, name, cost, x, y + 11, w, can ? UI.gold : UI.text, can ? UI.text : UI.dim)
}
