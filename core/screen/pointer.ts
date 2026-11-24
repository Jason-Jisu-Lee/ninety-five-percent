import { UI } from '../../data/look/palette'
import { POINTER } from '../../data/look/pointer'
import { ctx, mk } from './canvas'

const w = Math.max(...POINTER.map(r => r.length)), h = POINTER.length, one = ctx(mk(w, h))
POINTER.forEach((row, j) => [...row].forEach((c, i) => {
  one.fillStyle = c === '#' ? UI.panel : UI.text
  one.fillRect(i, j, 1, 1)
}))

function art(scale: number) {
  const k = Math.ceil(scale), big = ctx(mk(w * k, h * k)), out = ctx(mk(Math.ceil(w * scale), Math.ceil(h * scale)))
  big.imageSmoothingEnabled = false
  big.drawImage(one.canvas, 0, 0, w * k, h * k)
  out.drawImage(big.canvas, 0, 0, w * scale, h * scale)
  return out.canvas.toDataURL()
}

export function pointer(scale: number, dots: number) {
  const el = document.documentElement.style
  el.cursor = `url(${art(scale)}), auto`
  if (dots !== 1) el.cursor = `image-set(url("${art(scale * dots)}") ${dots}x), auto`
}
