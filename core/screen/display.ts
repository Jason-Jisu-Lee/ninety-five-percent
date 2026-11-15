import { H, W } from '../../data/look/screen'
import { ctx, mk } from './canvas'

export const canvas = document.querySelector('canvas')!
export const world = ctx(mk(W, H))
const out = ctx(canvas)

export function fit() {
  const d = devicePixelRatio || 1, s = Math.min(innerWidth / W, innerHeight / H), k = Math.max(1, Math.ceil(s * d - .001))
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

export function present() {
  out.imageSmoothingEnabled = false
  out.drawImage(world.canvas, 0, 0, canvas.width, canvas.height)
}

export function toWorld(e: MouseEvent): [number, number] {
  const r = canvas.getBoundingClientRect()
  return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]
}
