import { ctx, mk } from '../core/screen/canvas'
import { COLOR } from '../data/dragonfly/colors'
import { FLY } from '../data/dragonfly/flight'
import { H, W } from '../data/look/screen'
import { LOOKS } from '../data/pond/looks'
import { wear } from '../world/dragonfly/sprite/sheet'
import { scene } from '../world/pond/scene'

const NAMES = ['Day', 'Day, outlined'],q = new URLSearchParams(location.search), big = document.querySelector<HTMLCanvasElement>('main canvas')!, out = ctx(big), side = document.querySelector('aside')!
let seed = +(q.get('seed') ?? 0) || 1 + Math.random() * 99998 | 0, look = +(q.get('look') ?? 0), shots: HTMLCanvasElement[] = []

const thumbs = LOOKS.map((_, i) => {
  const b = side.appendChild(document.createElement('button')), c = b.appendChild(mk(W / 2, H / 2))
  b.insertAdjacentHTML('beforeend', `<b>${i + 1}</b>${NAMES[i]}`)
  b.onclick = () => show(look = i)
  return c
})

function fit() {
  const d = devicePixelRatio || 1, s = Math.max(1, Math.min((innerWidth - 32 - side.offsetWidth - 16) / W, (innerHeight - 24) / H)), n = Math.ceil(s * d - .001)
  Object.assign(big, { width: W * n, height: H * n })
  Object.assign(big.style, { width: W * s + 'px', height: H * s + 'px', imageRendering: Math.abs(s * d - n) < .001 ? 'pixelated' : 'auto' })
  out.imageSmoothingEnabled = false
  out.drawImage(shots[look], 0, 0, big.width, big.height)
}

function show(_?: unknown) {
  thumbs.forEach((c, i) => c.parentElement!.setAttribute('aria-pressed', String(i === look)))
  fit()
}

function fresh(_?: unknown) {
  const [fly] = wear(COLOR, [0, 0])(29, 0), half = fly.width >> 1, dark = mk(fly.width, fly.height), dg = ctx(dark)
  dg.drawImage(fly, 0, 0)
  dg.globalCompositeOperation = 'source-in'
  dg.fillRect(0, 0, dark.width, dark.height)
  shots = LOOKS.map((_, i) => {
    const c = scene(seed, i), g = ctx(c)
    g.globalAlpha = .35
    g.drawImage(dark, W / 2 + Math.round(FLY.height * .45) - half, H / 2 - half)
    g.globalAlpha = 1
    g.drawImage(fly, W / 2 - half, H / 2 - Math.round(FLY.height * .7) - half)
    const t = ctx(thumbs[i])
    t.imageSmoothingEnabled = false
    t.drawImage(c, 0, 0, W / 2, H / 2)
    return c
  })
  show()
}

document.querySelector<HTMLButtonElement>('#new')!.onclick = () => fresh(seed = 1 + Math.random() * 99998 | 0)
addEventListener('resize', fit)
fresh()
