import { H, W } from '../data/screen'
import { ctx, mk } from './canvas'

export const canvas = document.querySelector('canvas')!
export const world = ctx(mk(W, H))
const out = ctx(canvas)
let k = 0

export function fit() {
  const d = devicePixelRatio || 1, vw = Math.round(innerWidth * d), vh = Math.round(innerHeight * d)
  const s = Math.max(1, Math.floor(Math.min(vw / W, vh / H)))
  Object.assign(canvas.style, {
    width: W * s / d + 'px',
    height: H * s / d + 'px',
    left: (vw - W * s >> 1) / d + 'px',
    top: (vh - H * s >> 1) / d + 'px',
  })
  if (s === k) return
  k = s
  canvas.width = W * k
  canvas.height = H * k
}

export function present() {
  out.imageSmoothingEnabled = false
  out.drawImage(world.canvas, 0, 0, canvas.width, canvas.height)
}

export function toWorld(e: MouseEvent): [number, number] {
  const r = canvas.getBoundingClientRect()
  return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]
}
