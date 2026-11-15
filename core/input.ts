import { wake } from '../audio/music'
import { canvas, toWorld } from './display'
import { current } from './loop'

export function listen() {
  let at: [number, number] | undefined
  const point = () => {
    if (at) canvas.style.cursor = current().hover(...at) ? 'pointer' : ''
  }
  canvas.addEventListener('pointermove', e => {
    at = toWorld(e)
    point()
  })
  canvas.addEventListener('pointerleave', () => {
    at = undefined
  })
  canvas.addEventListener('pointerdown', e => {
    wake()
    current().click(...toWorld(e))
  })
  addEventListener('keydown', e => {
    wake()
    if (current().key(e.key.length > 1 ? e.key : e.key.toLowerCase())) e.preventDefault()
  })
  setInterval(point, 100)
}
