import { wake } from '../../audio/player/music'
import { canvas, toWorld } from '../screen/display'
import { current } from '../loop/loop'

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
    at = undefined
    wake()
    if (current().key(e.key.length > 1 ? e.key : e.key.toLowerCase())) e.preventDefault()
  })
  setInterval(point, 100)
}
