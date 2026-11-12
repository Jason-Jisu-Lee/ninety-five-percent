import { H, UH, UW, W } from '../data/screen'
import { ctx, mk } from './canvas'

export const canvas = document.querySelector('canvas')!
export const world = ctx(mk(W, H)), ui = ctx(mk(UW, UH))
const out = ctx(canvas), big = mk(1, 1)
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
  if (k > 1 && k & 1) {
    big.width = UW * (k + 1) / 2
    big.height = UH * (k + 1) / 2
  }
}

export function present(hud?: boolean) {
  out.imageSmoothingEnabled = false
  out.drawImage(world.canvas, 0, 0, canvas.width, canvas.height)
  if (!hud) return
  let src = ui.canvas
  if (k > 1 && k & 1) {
    const b = ctx(big)
    b.imageSmoothingEnabled = false
    b.clearRect(0, 0, big.width, big.height)
    b.drawImage(src, 0, 0, big.width, big.height)
    src = big
  }
  out.imageSmoothingEnabled = !!(k & 1)
  out.imageSmoothingQuality = 'high'
  out.drawImage(src, 0, 0, canvas.width, canvas.height)
}

export function toWorld(e: MouseEvent): [number, number] {
  const r = canvas.getBoundingClientRect()
  return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]
}
