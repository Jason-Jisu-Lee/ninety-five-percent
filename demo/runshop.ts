import './seed'
import { clamp } from '../core/math/clamp'
import { offered } from '../core/save/mutate'
import { save } from '../core/save/save'
import { pack } from '../core/save/wild'
import type { Ctx } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { FLY } from '../data/dragonfly/flight'
import { PREY, type Kind } from '../data/enemies/enemies'
import { MUTATE as M } from '../data/game/mutations'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { WILD, type Wild } from '../data/shop/wild'
import { foe } from '../ui/enemy/card'
import { details, DW } from '../ui/parts/details'
import { icon, orb } from '../ui/parts/icons'
import { note } from '../ui/parts/note'
import { panel } from '../ui/parts/panel'
import { text, width } from '../ui/text/text'
import { drawPrey } from '../world/creatures/draw'
import type { Prey } from '../world/creatures/prey'
import { wear } from '../world/dragonfly/sprite/sheet'
import { place } from '../world/place/place'
import { figure } from './base'

type Hit = [x: number, y: number, w: number, h: number]
type What = 'foe' | 'gene'
type Hot = [what: What, hit: Hit] | undefined
type Card = [name: string, cost: number, what?: What]
const STEPS = [[0, 6], [0, 15], [2, 60], [2, 230]], HIDE = '?????', R = W - 8, CW = 62, PEEK = 28, GAP = 4
const HOME: Partial<Record<Kind, number[]>> = { moth: [50, 106], mayfly: [300, 150], ladybird: [411, 112], bumblebee: [585, 98], wasp: [320, 200] }
let step = 0, shown = -1
const now = () => WILD[pack.got], next = () => WILD[pack.got + 1], can = (n: number) => save.blood >= n
const label = (w: Wild) => w.kind ? w.name : 'Expansion: ' + w.name
const inside = (mx: number, my: number, [x, y, w, h]: Hit) => mx >= x && mx < x + w && my >= y && my < y + h
const hand = (): Card[] => [[HIDE, next().cost], [label(now()), now().cost, 'foe'], ...(offered() ? [[M.name, M.cost, 'gene'] as Card] : [])]
const lit = (ok: boolean, on: boolean) => ok ? on ? UI.text : UI.gold : on ? UI.border : UI.line
const pay = (g: Ctx, n: number, r: number, y: number, col: string) => {
  const p = String(n)
  text(g, p, r, y, col, 'r')
  orb(g, r - width(p) - 5, y - 4, col === UI.text ? '' : col)
}
const mid = (g: Ctx, n: number, cx: number, y: number, col: string) => pay(g, n, cx + (width(String(n)) + 8 >> 1), y, col)

function face(g: Ctx, [name, cost, what]: Card, x: number, y: number, on: boolean, lock = false) {
  const ok = !!what && can(cost)
  panel(g, x, y, CW, 80, what ? lit(ok, on) : UI.line, UI.night)
  if (lock && !what) icon(g, 'lock', x + CW / 2 - 3, y + 5, UI.faint)
  else text(g, name, x + CW / 2, y + 12, !what ? UI.dim : ok ? UI.gold : UI.text, 'c')
  mid(g, cost, x + CW / 2, y + 24, ok ? UI.text : UI.dim)
}

function picture(g: Ctx, x: number, y: number, w: number, h: number, t: number, kind?: Kind) {
  const [hx, hy] = kind && HOME[kind] || [W / 2, H / 2], px = x + w / 2 + Math.sin(t * 1.1) * 16, py = y + h / 2 + Math.sin(t * 2.2) * 4, k = kind && PREY[kind]
  const [fly] = wear(save.color)(8, Math.floor(t * FLY.beat * DF.flapFrames) % DF.flapFrames)
  g.save()
  g.beginPath()
  g.rect(x, y, w, h)
  g.clip()
  g.drawImage(place().art, clamp(hx - w / 2, 0, W - w), clamp(hy - h / 2, 0, H - h), w, h, x, y, w, h)
  if (k) drawPrey(g, { kind, x: px, y: py + k.h * .7, h: k.h, ang: Math.atan2(Math.cos(t * 2.2) * 8.8, Math.cos(t * 1.1) * 17.6), hp: k.hp, wings: true, flash: 0, seed: .3 } as Prey, t)
  else g.drawImage(fly, x + w / 2 - (fly.width >> 1), y + h / 2 - (fly.height >> 1))
  g.restore()
}

function row(g: Ctx, mx: number, my: number, slot: (n: number) => number, lock = false, rise = 10) {
  let hot: Hot
  hand().forEach((c, n) => {
    const x = slot(n), on = !!c[2] && inside(mx, my, [x, H - PEEK - rise, CW, PEEK + rise]), y = H - PEEK - +on * rise
    face(g, c, x, y, on, lock)
    if (on) hot = [c[2]!, [x, y, CW, PEEK]]
  })
  return hot
}

const WAYS: [string, string, (g: Ctx, mx: number, my: number, t: number) => Hot][] = [
  ['Hand', 'The cards you liked, bottom right. The one after next is a dim card that reads ????? with its price, the way the game writes it now. No dots', (g, mx, my) => row(g, mx, my, n => R - CW - n * (CW + GAP))],
  ['Locked card', 'The same hand, but the one after next carries the padlock from the Lair instead of question marks', (g, mx, my) => row(g, mx, my, n => R - CW - n * (CW + GAP), true)],
  ['Picture cards', 'At rest the same hand. Point at a card and it rises all the way to show a picture: the enemy flying where it lives, or your dragonfly for Mutations', (g, mx, my, t) => {
    let hot: Hot
    const cards = hand(), was = shown
    shown = cards.findIndex((c, n) => !!c[2] && inside(mx, my, [R - CW - n * (CW + GAP), H - (n === was ? 66 : PEEK), CW, 66]))
    cards.forEach((c, n) => {
      const x = R - CW - n * (CW + GAP), on = n === shown, y = H - (on ? 66 : PEEK)
      face(g, c, x, y, on)
      if (!on) return
      picture(g, x + 3, y + 30, CW - 6, 33, t, c[2] === 'foe' ? now().kind : undefined)
      hot = [c[2]!, [x, y, CW, 66]]
    })
    return hot
  }],
  ['Hand in the middle', 'The hand held at the bottom centre of the screen like in a card game, the cards overlapping a little. The card under the pointer comes to the front and lifts', (g, mx, my) => {
    const cards = hand(), slot = (n: number) => W / 2 - 87 + (2 - n) * 56, on = cards.findIndex((c, n) => !!c[2] && inside(mx, my, [slot(n), H - PEEK - 10, 56, PEEK + 10]))
    for (let n = cards.length; n--;) if (n !== on) face(g, cards[n], slot(n), H - PEEK, false)
    if (on < 0) return
    face(g, cards[on], slot(on), H - PEEK - 10, true)
    return [cards[on][2]!, [slot(on), H - PEEK - 10, CW, PEEK]]
  }],
  ['Deck', 'The one after next sits behind the next card and peeks out above it, like the next card of a deck. Mutations is a card of its own beside them', (g, mx, my) => {
    const [after, front, gene] = hand(), x = R - CW, on = inside(mx, my, [x, H - PEEK, CW, PEEK]), gx = x - CW - GAP, onGene = !!gene && inside(mx, my, [gx, H - PEEK - 10, CW, PEEK + 10])
    panel(g, x, H - PEEK - 14, CW, 40, UI.line, UI.night)
    text(g, after[0], x + 5, H - PEEK - 3, UI.dim)
    pay(g, after[1], x + CW - 5, H - PEEK - 3, UI.dim)
    face(g, front, x, H - PEEK, on)
    if (gene) face(g, gene, gx, H - PEEK - +onGene * 10, onGene)
    return on ? ['foe', [x, H - PEEK - 14, CW, PEEK]] : onGene ? ['gene', [gx, H - PEEK - 10, CW, PEEK]] : undefined
  }],
]

const host = document.querySelector('section')!, click = () => {
  step = (step + 1) % STEPS.length
  ;[pack.got, save.blood] = STEPS[step]
}
;[pack.got, save.blood] = STEPS[0]
WAYS.forEach(([name, say, draw], i) => figure(host, i + 1, name, say, (g, mx, my, t) => {
  const hot = draw(g, mx, my, t), kind = now().kind
  if (!hot) return
  const [x, y, w] = hot[1]
  if (hot[0] === 'foe') kind && details(g, foe(kind), tall => [clamp(x + w - DW, 8, W - 8 - DW), y - 6 - tall])
  else note(g, [M.say], clamp(x, 4, W - 140), y - 4, false, true)
}, { shop: false, click, view: [i === 3 ? 120 : 240, 60, 400, 300] }))
