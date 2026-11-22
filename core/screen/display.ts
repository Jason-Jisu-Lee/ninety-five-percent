import { H, W } from '../../data/look/screen'
import { ctx, mk, type Ctx } from './canvas'

export const canvas = document.querySelector('canvas')!
export const world = ctx(mk(W, H))
const out = ctx(canvas), VIEWS: [string, number][] = [['1080p', 3], ['720p', 2], ['1440p', 4], ['Fit', 0]]

export const view = {
  n: import.meta.env.DEV ? 0 : VIEWS.length - 1,
  name: () => VIEWS[view.n][0],
  next() {
    view.n = (view.n + 1) % VIEWS.length
    fit()
  },
}

export function fit() {
  const d = devicePixelRatio || 1, room = Math.min(innerWidth / W, innerHeight / H), whole = VIEWS[view.n][1]
  const k = Math.max(1, whole ? Math.min(whole, Math.floor(room * d + .001)) : Math.ceil(room * d - .001)), s = whole ? k / d : room
  Object.assign(canvas.style, {
    width: W * s + 'px',
    height: H * s + 'px',
    left: Math.round((innerWidth - W * s) * d / 2) / d + 'px',
    top: Math.round((innerHeight - H * s) * d / 2) / d + 'px',
    imageRendering: Math.abs(s * d - k) < .001 ? 'pixelated' : 'auto',
  })
  if (canvas.width === W * k) return
  canvas.width = W * k
  canvas.height = H * k
}

export function present(over: (g: Ctx, k: number) => void) {
  out.imageSmoothingEnabled = false
  out.drawImage(world.canvas, 0, 0, canvas.width, canvas.height)
  over(out, canvas.width / W)
}

export function toWorld(e: MouseEvent): [number, number] {
  const r = canvas.getBoundingClientRect()
  return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]
}
