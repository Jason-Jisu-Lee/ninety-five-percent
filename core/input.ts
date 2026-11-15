import { canvas, toWorld } from './display'
import { current } from './loop'

export function listen() {
  canvas.addEventListener('pointermove', e => {
    canvas.style.cursor = current().hover(...toWorld(e)) ? 'pointer' : ''
  })
  canvas.addEventListener('pointerdown', e => current().click(...toWorld(e)))
  addEventListener('keydown', e => {
    if (current().key(e.key)) e.preventDefault()
  })
}
