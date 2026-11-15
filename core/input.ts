import { wake } from '../audio/music'
import { canvas, toWorld } from './display'
import { current } from './loop'

export function listen() {
  canvas.addEventListener('pointermove', e => {
    canvas.style.cursor = current().hover(...toWorld(e)) ? 'pointer' : ''
  })
  canvas.addEventListener('pointerdown', e => {
    wake()
    current().click(...toWorld(e))
  })
  addEventListener('keydown', e => {
    wake()
    if (current().key(e.key.length > 1 ? e.key : e.key.toLowerCase())) e.preventDefault()
  })
}
