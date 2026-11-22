import { ctx, mk } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { COLOR } from '../data/dragonfly/colors'
import { FLY } from '../data/dragonfly/flight'
import { H, W } from '../data/look/screen'
import { LEVELS, OWNED, zoom, type Own } from '../data/map/plan'
import { wear } from '../world/dragonfly/sprite/sheet'
import { make, type World } from '../world/map/make'
import { paint } from '../world/map/paint'

const NAMES: Record<Own, string> = { pads: 'Lily pads', reeds: 'Reed beds', flowers: 'Flowers', stones: 'Basking stones', log: 'Old log', ferns: 'Ferns', ring: 'Mushroom ring', fruit: 'Fallen fruit' }
const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!
const q = new URLSearchParams(location.search), canvas = $<HTMLCanvasElement>('canvas'), out = ctx(canvas), g = ctx(mk(W, H)), frame = $('.frame')
const has = new Set<Own>(q.get('own') === 'none' ? [] : OWNED)
let world: World, level = +(q.get('level') ?? 0), took = 0

const button = (into: string, text: string, tap: () => void) => {
  const b = $(into).appendChild(document.createElement('button'))
  b.textContent = text
  b.onclick = tap
  return b
}
const views = Array.from({ length: LEVELS + 1 }, (_, i) => button('#views', i ? i < LEVELS ? 'Expand ' + i : 'Full map' : 'First screen', () => show(level = i)))
const owned = OWNED.map(o => button('#owned', NAMES[o], () => show(has.delete(o) || has.add(o))))

function fit() {
  const d = devicePixelRatio || 1, s = Math.max(1, Math.min((innerWidth - 32) / W, (innerHeight - $('.stage').offsetTop - 12) / H)), n = Math.ceil(s * d - .001), k = 1 / zoom(level), w = W * s * k, h = H * s * k
  Object.assign(canvas, { width: W * n, height: H * n })
  Object.assign(canvas.style, { width: W * s + 'px', height: H * s + 'px', imageRendering: Math.abs(s * d - n) < .001 ? 'pixelated' : 'auto' })
  Object.assign(frame.style, { width: w + 'px', height: h + 'px', left: (W * s - w) / 2 + 'px', top: (H * s - h) / 2 + 'px' })
  frame.hidden = !level
  out.imageSmoothingEnabled = false
  out.drawImage(g.canvas, 0, 0, canvas.width, canvas.height)
}

function show(_?: unknown) {
  const t = performance.now(), k = 1 / zoom(level), [fly, shadow] = wear(COLOR, [0, 0], DF.scale * k)(29, 0), half = fly.width >> 1, h = FLY.height * k
  g.drawImage(paint(world, level, o => has.has(o)), 0, 0)
  g.drawImage(shadow, W / 2 + Math.round(h * .45) - half, H / 2 - half)
  g.drawImage(fly, W / 2 - half, H / 2 - Math.round(h * .7) - half)
  $('#cost').innerHTML = `Map made in ${took.toFixed(0)} ms<br>View drawn in ${(performance.now() - t).toFixed(0)} ms`
  views.forEach((b, i) => b.setAttribute('aria-pressed', String(i === level)))
  owned.forEach((b, i) => b.setAttribute('aria-pressed', String(has.has(OWNED[i]))))
  fit()
}

function fresh(seed = 1 + Math.random() * 99998 | 0) {
  const t = performance.now()
  world = make(seed)
  took = performance.now() - t
  $('#name').textContent = 'Map ' + seed
  show()
}

$('#new').onclick = () => fresh()
$('#all').onclick = () => show(OWNED.forEach(o => has.add(o)))
$('#none').onclick = () => show(has.clear())
addEventListener('resize', fit)
addEventListener('keydown', e => {
  if (e.key === 'n' || e.key === ' ') fresh()
  else if (e.key === 'ArrowRight') show(level = Math.min(LEVELS, level + 1))
  else if (e.key === 'ArrowLeft') show(level = Math.max(0, level - 1))
  else return
  e.preventDefault()
})
fresh(q.has('seed') ? +q.get('seed')! : undefined)
