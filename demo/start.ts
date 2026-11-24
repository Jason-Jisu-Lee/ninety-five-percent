import './start/fresh'
import { figure } from './start/figure'

const cork = new Audio('./sounds/cork.wav')
const frame = figure(document.querySelector<HTMLElement>('#whole')!, 2, () => {
  const s = cork.cloneNode() as HTMLAudioElement
  s.volume = .6
  s.play().catch(() => {})
})

let last = -1
function tick(at: number) {
  requestAnimationFrame(tick)
  frame(last < 0 ? 0 : Math.min(.05, (at - last) / 1000))
  last = at
}
requestAnimationFrame(tick)
