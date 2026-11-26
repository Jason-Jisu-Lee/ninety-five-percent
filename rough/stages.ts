import { ctx, mk } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { COLOR } from '../data/dragonfly/colors'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { hud } from '../ui/hud/hud'
import { text } from '../ui/text/text'
import { glow } from '../ui/track/track'
import { wear } from '../world/dragonfly/sprite/sheet'
import type { Place } from '../world/place/kit'
import { forest1 } from './stages/forest1'
import { forest2 } from './stages/forest2'
import { land1 } from './stages/land1'
import { land2 } from './stages/land2'
import { river1 } from './stages/river1'
import { river2 } from './stages/river2'

type Make = (seed: number) => Place

const STAGES: [title: string, fly: number, versions: [string, Make][]][] = [
  ['Stage 3: River', 22, [['River bend', river1], ['Gravel bar', river2]]],
  ['Stage 4: Meadow', 21, [['Open meadow', land1], ['Forest edge', land2]]],
  ['Stage 5: Forest', 20, [['Clearing', forest1], ['Bear den', forest2]]],
]
const SWARM = [[0, 0, 29], [-26, 14, 27], [22, 18, 31], [-8, 30, 28], [30, -10, 30]]

const q = new URLSearchParams(location.search), big = document.querySelector<HTMLCanvasElement>('main canvas')!, out = ctx(big), side = document.querySelector('aside')!, grid = side.querySelector('.grid')!
const frame = ctx(mk(W, H)), ui = hud(() => {}, () => {}, () => {}, () => {}, () => {}, () => {}, []), hudOn = document.querySelector<HTMLButtonElement>('#hud')!
let seed = +(q.get('seed') ?? 0) || 1 + Math.random() * 99998 | 0, pick = +(q.get('v') ?? 0), buttons = q.get('hud') !== '0', places: Place[] = []

const thumbs = STAGES.flatMap(([title, , versions], stage) => {
  const row = grid.appendChild(document.createElement('div'))
  row.innerHTML = `<h2>${title}</h2>`
  return versions.map(([name], i) => {
    const b = row.appendChild(document.createElement('button')), c = b.appendChild(mk(W / 4, H / 4))
    b.insertAdjacentHTML('beforeend', `<b>${i + 1}</b>${name}`)
    b.onclick = () => show(pick = stage * 2 + i)
    return c
  })
})

function fit() {
  const d = devicePixelRatio || 1, space = (wide: number) => Math.max(1, Math.min((innerWidth - 48 - wide) / W, (innerHeight - 24) / H)), slim = Math.floor(space(136)) > Math.floor(space(336))
  const room = space(slim ? 136 : 336), s = room < 2 ? room : Math.floor(room), k = Math.ceil(s * d - .001), sheet = wear(COLOR, DF.scale * STAGES[pick >> 1][1] / 34)
  side.classList.toggle('slim', slim)
  frame.drawImage(places[pick].art, 0, 0)
  for (const [dx, dy, heading] of SWARM) {
    const [fly, shadow] = sheet(heading, 0), half = fly.width >> 1
    frame.drawImage(shadow, W / 2 + dx + 5 - half, H / 2 + dy - half)
    frame.drawImage(fly, W / 2 + dx - half, H / 2 + dy - 7 - half)
  }
  if (buttons) {
    ui.draw(frame, false)
    text(frame, 'Ninety-Five', W - 73, 20, UI.text, 'r', UI.panel)
  }
  Object.assign(big, { width: W * k, height: H * k })
  Object.assign(big.style, { width: W * s + 'px', height: H * s + 'px', imageRendering: Math.abs(s * d - k) < .001 ? 'pixelated' : 'auto' })
  out.imageSmoothingEnabled = false
  out.drawImage(frame.canvas, 0, 0, big.width, big.height)
  if (buttons) glow(out, k, 1, 0)
}

function show(_?: unknown) {
  thumbs.forEach((c, i) => c.parentElement!.setAttribute('aria-pressed', String(i === pick)))
  hudOn.setAttribute('aria-pressed', String(buttons))
  fit()
}

function fresh(_?: unknown) {
  places = STAGES.flatMap(([, , versions]) => versions).map(([, make], i) => {
    const place = make(seed + i)
    ctx(thumbs[i]).drawImage(place.art, 0, 0, W / 4, H / 4)
    return place
  })
  show()
}

document.querySelector<HTMLButtonElement>('#new')!.onclick = () => fresh(seed = 1 + Math.random() * 99998 | 0)
hudOn.onclick = () => show(buttons = !buttons)
addEventListener('resize', fit)
fresh()
