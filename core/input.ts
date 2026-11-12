import { canvas, toWorld } from './display'
import { current, redraw } from './loop'

function point(e: PointerEvent, press?: boolean) {
  const [x, y] = toWorld(e)
  if (press) current().click?.(x, y)
  const s = current()
  canvas.style.cursor = s.hover?.(x, y) ? 'pointer' : ''
  if (s.hover || press) redraw()
}

export function listen() {
  canvas.addEventListener('pointermove', e => point(e))
  canvas.addEventListener('pointerdown', e => point(e, true))
  addEventListener('keydown', e => {
    if (!current().key?.(e.key)) return
    e.preventDefault()
    redraw()
  })
}
