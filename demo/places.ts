import { rng } from '../core/math/rng'
import { ctx, mk } from '../core/screen/canvas'
import { COLOR } from '../data/dragonfly/colors'
import { PREY, type Kind } from '../data/enemies/enemies'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { hud } from '../ui/hud/hud'
import { text } from '../ui/text/text'
import { glow } from '../ui/track/track'
import { drawPrey } from '../world/creatures/draw'
import type { Prey } from '../world/creatures/prey'
import { wear } from '../world/dragonfly/sprite/sheet'
import type { Place, Zone } from './places/kit'
import { marsh1 } from './places/marsh1'
import { marsh2 } from './places/marsh2'
import { marsh3 } from './places/marsh3'
import { pond1 } from './places/pond1'
import { pond2 } from './places/pond2'
import { pond3 } from './places/pond3'

const VERSIONS: [name: string, make: (seed: number) => Place][] = [
  ['Over the water', pond1], ['The whole pond', pond2], ['Through the leaves', pond3],
  ['Channels', marsh1], ['Open marsh', marsh2], ['Dark water', marsh3],
]
const AREAS: Record<Zone['kind'], string[]> = {
  open: ['#8fc4c2', 'Open water', 'Room to dive', 'Swarms gather here'],
  pads: ['#7fb062', 'Lily pads', 'Rest spots'],
  reeds: ['#c9a45c', 'Reeds', 'Cover for an ambush', 'Prey hides here'],
  flowers: ['#e58aa0', 'Flowers', 'Draw bees and moths', 'Rich prey that fights back'],
  stones: ['#c9c0b2', 'Stones', 'Warm in the sun', 'Faster rest'],
  log: ['#b0714f', 'Dead wood', 'A long perch', 'Flies gather on it'],
  mud: ['#b9a36a', 'Mud', 'Easy prey', 'A safe start'],
  weed: ['#a3c96a', 'Duckweed', 'Something waits under it'],
  shade: ['#a98be0', 'Shade', 'Hidden from threats'],
}
const HOME: Partial<Record<Zone['kind'], Kind[]>>[] = [
  { open: ['mayfly', 'fruitfly'], flowers: ['moth', 'bumblebee'], stones: ['ladybird'], log: ['fruitfly'], reeds: ['fruitfly'] },
  { open: ['damselfly', 'cranefly'], flowers: ['whitebutterfly', 'lacewing'], stones: ['junebeetle'], log: ['cicada'], reeds: ['firefly'], weed: ['frog'], mud: ['cranefly'] },
]

const q = new URLSearchParams(location.search), big = document.querySelector<HTMLCanvasElement>('main canvas')!, out = ctx(big), side = document.querySelector('aside')!, grid = side.querySelector('.grid')!, list = side.querySelector('ul')!
const flag = (id: string) => Object.assign(document.querySelector<HTMLButtonElement>('#' + id)!, { onclick: () => show(on[id] = !on[id]) }), on: Record<string, boolean> = { hud: q.get('hud') !== '0', zones: q.get('zones') === '1' }
const frame = ctx(mk(W, H)), ui = hud(() => {}, () => {}, () => {}, []), toggles = ['hud', 'zones'].map(flag)
let seed = +(q.get('seed') ?? 0) || 1 + Math.random() * 99998 | 0, pick = +(q.get('v') ?? 0), places: Place[] = []

const thumbs = [0, 1].flatMap(stage => {
  grid.insertAdjacentHTML('beforeend', `<h2 style="grid-row:1;grid-column:${stage + 1}">Stage ${stage + 1}: ${stage ? 'Marsh' : 'Pond'}</h2>`)
  return [0, 1, 2].map(i => {
    const b = grid.appendChild(document.createElement('button')), c = b.appendChild(mk(W / 4, H / 4)), n = stage * 3 + i
    b.style.cssText = `grid-row:${i + 2};grid-column:${stage + 1}`
    b.insertAdjacentHTML('beforeend', `<b>${i + 1}</b>${VERSIONS[n][0]}`)
    b.onclick = () => show(pick = n)
    return c
  })
})

function actors(g: CanvasRenderingContext2D, place: Place, stage: number) {
  const R = rng(seed + 7), [fly, shadow] = wear(COLOR)(29, 0), half = fly.width >> 1, prey: Prey[] = []
  for (const z of place.zones) for (const kind of HOME[stage][z.kind] ?? []) for (let i = 0, n = Math.min(kind === 'fruitfly' ? 7 : 2, PREY[kind].count); i < n; i++)
    prey.push({ kind, x: z.x + (R() - .5) * z.rx * 1.4, y: z.y + (R() - .5) * z.ry * 1.4 + PREY[kind].h * .7, h: PREY[kind].h, ang: R() * 6.283, hp: PREY[kind].hp, wings: true, flash: 0, seed: R() } as Prey)
  for (const p of prey) drawPrey(g, p, 0, true)
  g.drawImage(shadow, W / 2 + 7 - half, H / 2 - half)
  for (const p of prey) drawPrey(g, p, 0)
  g.drawImage(fly, W / 2 - half, H / 2 - 10 - half)
}

function areas(g: CanvasRenderingContext2D, zones: Zone[]) {
  for (const z of zones) {
    const [col, name] = AREAS[z.kind], x = Math.round(z.x - z.rx), y = Math.round(z.y - z.ry), w = Math.round(z.rx * 2), h = Math.round(z.ry * 2)
    for (const [c, grow] of [[UI.panel, 1], [col, 0]] as const) {
      g.fillStyle = c
      for (const [rx, ry, rw, rh] of [[x + 3, y, w - 6, 1], [x + 3, y + h - 1, w - 6, 1], [x, y + 3, 1, h - 6], [x + w - 1, y + 3, 1, h - 6], [x + 1, y + 1, 2, 2], [x + w - 3, y + 1, 2, 2], [x + 1, y + h - 3, 2, 2], [x + w - 3, y + h - 3, 2, 2]])
        g.fillRect(rx - grow, ry - grow, rw + grow * 2, rh + grow * 2)
    }
    text(g, name, Math.round(z.x), y + 11, col, 'c', UI.panel)
  }
}

function fit() {
  const d = devicePixelRatio || 1, room = Math.max(1, Math.min((innerWidth - 48 - side.offsetWidth) / W, (innerHeight - 24) / H)), s = room < 2 ? room : Math.floor(room), k = Math.ceil(s * d - .001), place = places[pick]
  frame.drawImage(place.art, 0, 0)
  actors(frame, place, pick / 3 | 0)
  if (on.zones) areas(frame, place.zones)
  if (on.hud) {
    ui.draw(frame, false)
    text(frame, 'Ninety-Five', W - 73, 20, UI.text, 'r', UI.panel)
  }
  Object.assign(big, { width: W * k, height: H * k })
  Object.assign(big.style, { width: W * s + 'px', height: H * s + 'px', imageRendering: Math.abs(s * d - k) < .001 ? 'pixelated' : 'auto' })
  out.imageSmoothingEnabled = false
  out.drawImage(frame.canvas, 0, 0, big.width, big.height)
  if (on.hud) glow(out, k, 1)
}

function show(_?: unknown) {
  thumbs.forEach((c, i) => c.parentElement!.setAttribute('aria-pressed', String(i === pick)))
  toggles.forEach(b => b.setAttribute('aria-pressed', String(on[b.id])))
  const zones = places[pick].zones, kinds = [...new Set(zones.map(z => z.kind))]
  list.innerHTML = on.zones ? kinds.map(kind => `<li><i style="background:${AREAS[kind][0]}"></i><b>${AREAS[kind][1]}</b> x ${zones.filter(z => z.kind === kind).length}<br>${AREAS[kind].slice(2).join('<br>')}</li>`).join('') : ''
  fit()
}

function fresh(_?: unknown) {
  places = VERSIONS.map(([, make], i) => {
    const place = make(seed + i), t = ctx(thumbs[i])
    t.drawImage(place.art, 0, 0, W / 4, H / 4)
    return place
  })
  show()
}

document.querySelector<HTMLButtonElement>('#new')!.onclick = () => fresh(seed = 1 + Math.random() * 99998 | 0)
addEventListener('resize', fit)
fresh()
